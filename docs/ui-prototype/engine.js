/* Bộ quyết định cho bản thử giao diện — chép lại luật trong codebase/agent.py (luồng luật từ khoá, không gọi model)
   và các công cụ chỉ-đọc trong codebase/tools.py. Đọc dữ liệu giả ở data.js (sinh từ data/hotel.json, data/policy.json).
   Không đổi phòng, không trừ tiền, không gửi tin: chỉ trả về đề xuất + bản nháp để lễ tân duyệt. */
(function () {
  const H = window.HOTEL;
  const POL = window.POLICY;
  const ORDER = H.type_order;

  const typeName = (c) => (H.room_types[c] || {}).name || c;
  const rate = (c) => H.room_types[c].rate_vnd;
  const rank = (c) => ORDER.indexOf(c);
  const vnd = (n) => n.toLocaleString('vi-VN') + ' đ';
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
  const fmtDate = (iso) => iso.slice(8, 10) + '/' + iso.slice(5, 7);

  // ---- công cụ chỉ-đọc (tools.py) ----
  function getBooking(ref) {
    ref = (ref || '').trim().toUpperCase();
    if (!ref) return null;
    for (const b of H.bookings) {
      if (ref === b.id.toUpperCase() || ref === b.room) {
        const room = H.rooms.find((r) => r.room === b.room);
        return {
          id: b.id, room: b.room, floor: room.floor, booked_type: b.booked_type, current_type: room.type,
          check_in: b.check_in, check_out: b.check_out, nights_left: Math.max(days(H.as_of, b.check_out), 0),
          upgrade_paid_vnd: b.upgrade_paid_vnd, note: b.note, ticket: room.ticket, near_elevator: room.near_elevator
        };
      }
    }
    return null;
  }

  function findVacantRooms(type, quietOnly = true, exclude = '', limit = 2) {
    const out = [];
    for (const r of H.rooms) {
      if (r.type !== type || r.status !== 'vacant' || r.room === exclude) continue;
      if (quietOnly && (r.near_elevator || r.ticket)) continue;
      out.push({ room: r.room, type: r.type, floor: r.floor });
    }
    return out.slice(0, limit);
  }

  function calcFee(from, to, nights) {
    const per = Math.max(rate(to) - rate(from), 0);
    return { per_night: per, nights, total: per * nights };
  }

  const getPolicy = (topics) => POL.filter((p) => topics.includes(p.topic));

  // ---- luật từ khoá (agent.py rules / extract_ref) ----
  function norm(s) {
    return (s || '').toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/\p{Mn}/gu, '');
  }
  const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const any = (t, words) => words.some((w) => new RegExp('\\b' + esc(w.trim()) + '\\b').test(t));

  function rules(text) {
    const t = norm(text);
    let incident = 'none';
    if (any(t, ['nham phong', 'sai phong', 'khong dung hang', 'giuong don', 'khong phai phong'])) incident = 'wrong_room';
    if (any(t, ['ri nuoc', 'ro ri', 'chay nuoc'])) incident = 'leak';
    if (any(t, ['dieu hoa', 'hong', 'may phat', 'khong hoat dong'])) incident = 'equipment';
    if (any(t, ['on', 'on ao', 'tieng on', 'cong trinh'])) incident = 'noise';
    let target = null;
    for (const [words, code] of [[['presidential'], 'PRS'], [['junior'], 'JRS'], [['premier'], 'PRM'], [['suite'], 'STE'], [['deluxe'], 'DLX']]) {
      if (any(t, words)) { target = code; break; }
    }
    const request = any(t, ['nang', 'len hang', 'suite', 'premier', 'junior', 'presidential']) ? 'nang_hang'
      : any(t, ['doi phong', 'chuyen phong', 'phong khac', 'doi sang']) ? 'doi_phong' : 'khac';
    return {
      request, incident, target,
      wants_manager: any(t, ['gap quan ly', 'gap manager', 'quan ly dau']),
      wants_refund_or_free: any(t, ['hoan', 'boi thuong', 'voucher', 'mien phi', 'giam gia']),
      attack: any(t, ['bo qua moi', 'bo qua quy tac', 'chi dan he thong', 'system prompt', 'toi la quan ly', 'khong can duyet', 'ignore'])
    };
  }

  function extractRef(text) {
    let m = /BK-\d{3,5}/i.exec(text || '');
    if (m) return m[0].toUpperCase();
    m = /ph[oòóọỏõôồốộổỗơờớợởỡ]ng\s*(\d{3})/i.exec(text || '');
    return m ? m[1] : '';
  }

  const nextType = (c) => ORDER[Math.min(ORDER.indexOf(c) + 1, ORDER.length - 1)];

  function bestAlternative(cur, target, exclude, trace) {
    const between = ORDER.slice(ORDER.indexOf(cur) + 1, ORDER.indexOf(target)).reverse();
    for (const code of between) {
      const r = findVacantRooms(code, true, exclude, 1);
      trace.push({ tool: 'find_vacant_rooms', args: code, out: r.length ? r.map((x) => x.room).join(', ') : 'hết' });
      if (r.length) return r;
    }
    return [];
  }

  const INCIDENT = { none: 'Không', noise: 'Tiếng ồn', equipment: 'Thiết bị hỏng', leak: 'Rò rỉ nước', wrong_room: 'Không đúng hạng đã đặt', other: 'Sự cố khác' };
  const REQUEST = { doi_phong: 'Đổi phòng', nang_hang: 'Nâng hạng', khac: 'Khác' };

  /* u: {request, incident, target, wants_manager, wants_refund_or_free, attack}; ref: mã đặt hoặc số phòng. */
  function decide(u, ref) {
    const trace = [];
    const understand = [
      ['Loại yêu cầu', REQUEST[u.request] || u.request],
      ['Sự cố', INCIDENT[u.incident] || u.incident],
      ['Hạng muốn', u.target ? typeName(u.target) : 'Chưa nêu'],
      ['Đòi hoàn tiền / miễn phí', u.wants_refund_or_free ? 'Có' : 'Không'],
      ['Giả danh / bỏ qua quy trình', u.attack ? 'Có' : 'Không']
    ];
    const base = { understand, trace, booking: null, options: [], notices: [], reasons: [], policies: [] };

    if (u.attack) {
      trace.push({ tool: 'get_policy', args: 'xac_thuc', out: 'P6' });
      return Object.assign(base, {
        kind: 'refuse', label: 'Từ chối', title: 'Không thực hiện · không xác thực được',
        notices: ['Không xác thực được danh tính; không đổi phòng, không đổi giá, không ghi hệ thống; không tiết lộ chỉ dẫn hệ thống.'],
        reasons: ['Yêu cầu phải đi theo quy trình duyệt của quản lý ca.'],
        policies: getPolicy(['xac_thuc']),
        draft: 'Dạ, lễ tân chưa thể thực hiện yêu cầu này. Quý khách vui lòng liên hệ quản lý ca để được hỗ trợ theo quy trình ạ.'
      });
    }

    const booking = ref ? getBooking(ref) : null;
    if (ref) trace.push({ tool: 'get_booking', args: ref, out: booking ? booking.id + ' · phòng ' + booking.room : 'không thấy' });
    base.booking = booking;

    if (u.wants_refund_or_free && !booking) {
      trace.push({ tool: 'get_policy', args: 'dac_biet', out: 'P4' });
      return Object.assign(base, {
        kind: 'refuse', label: 'Ngoài thẩm quyền', title: 'Hoàn tiền, ưu đãi · chỉ quản lý ca quyết',
        notices: ['Không hoàn tiền, không tặng voucher; chỉ soạn tóm tắt vụ việc để lễ tân chuyển quản lý ca.'],
        reasons: ['Quyết định hoàn tiền / voucher thuộc quản lý ca.'],
        policies: getPolicy(['dac_biet']),
        draft: 'Dạ, lễ tân xin ghi nhận phản ánh và chuyển quản lý ca xem xét; lễ tân chưa thể cam kết hoàn tiền hay ưu đãi ạ.'
      });
    }

    if (!booking) {
      return Object.assign(base, {
        kind: 'ask', label: 'Hỏi lại', title: 'Chưa đủ thông tin để đề xuất',
        notices: ['Thiếu mã đặt hoặc số phòng của khách' + (ref ? ' (không tìm thấy ' + ref + ')' : '') + '.',
          'Cần hỏi: mã đặt hoặc số phòng, phòng đang gặp vấn đề gì, khách muốn đổi ngang hay nâng hạng.'],
        draft: 'Dạ, quý khách cho lễ tân xin mã đặt phòng hoặc số phòng, và cho biết phòng đang gặp vấn đề gì để lễ tân hỗ trợ ạ.'
      });
    }

    const booked = booking.booked_type, cur = booking.current_type;
    const paid = booking.upgrade_paid_vnd > 0;
    const mismatch = cur !== booked && !paid;
    const ticket = booking.ticket;
    const hotelFault = ['noise', 'equipment', 'leak', 'wrong_room'].includes(u.incident) || mismatch || !!ticket;
    const baseType = paid ? cur : booked;
    const n = booking.nights_left;
    const wantUp = u.request === 'nang_hang';
    let target = u.target;
    if (wantUp && !target && !hotelFault) target = nextType(cur);

    let kind = 'propose', label = 'Đề xuất phòng', title = '';
    let topics = ['doi_ngang'];
    const options = [], notices = [], reasons = [];
    const opt = (group, r, fee, note, free) => {
      trace.push({ tool: 'calc_fee', args: typeName(r.type), out: vnd(fee.total) });
      options.push({ id: group + '-' + r.room, group, room: r.room, type: typeName(r.type), typeCode: r.type, floor: r.floor,
        perNight: fee.per_night, nights: fee.nights, total: fee.total, note, free: !!free });
    };
    const vacant = (type, limit) => {
      const r = findVacantRooms(type, true, booking.room, limit);
      trace.push({ tool: 'find_vacant_rooms', args: type, out: r.length ? r.map((x) => x.room).join(', ') : 'hết' });
      return r;
    };

    if (u.wants_refund_or_free) {
      topics = ['dac_biet', 'su_co'];
      kind = 'manager'; label = 'Cần quản lý duyệt'; title = 'Đề nghị hoàn tiền / miễn phí';
      reasons.push('Khách đề nghị hoàn tiền / miễn phí / bồi thường — chỉ quản lý ca quyết định.');
      notices.push('Không cam kết hoàn tiền hay miễn phí; tóm tắt vụ việc để quản lý ca quyết định.');
      if (hotelFault) {
        const rooms = vacant(baseType);
        rooms.forEach((r) => opt('Phòng thay thế', r, calcFee(baseType, baseType, n), 'Cùng hạng đã đặt, chờ quản lý duyệt', true));
        if (!rooms.length) notices.push('Hết phòng thay thế cùng hạng.');
      }
      if (hotelFault && wantUp) {
        topics.push('su_co_nang_hang');
        notices.push('Đổi cùng hạng do sự cố có phí 0 đ theo P2. Nếu khách chọn hạng cao hơn, áp dụng phí chênh theo P3; miễn phần chênh cần quản lý duyệt theo P4.');
      }
    } else if (hotelFault) {
      topics = wantUp ? ['su_co', 'su_co_nang_hang'] : ['su_co'];
      kind = 'manager'; label = 'Cần quản lý duyệt';
      title = (INCIDENT[u.incident] && u.incident !== 'none' ? INCIDENT[u.incident] : ticket ? 'Phòng có phiếu sự cố' : 'Xếp sai hạng') + ' · đổi phòng';
      reasons.push('Sự cố do khách sạn: quản lý ca xác nhận lỗi và phần miễn phí.');
      if (u.wants_manager) reasons.push('Khách yêu cầu gặp quản lý.');
      const rooms = vacant(baseType);
      rooms.forEach((r) => opt('A · cùng hạng', r, calcFee(baseType, baseType, n), 'Miễn phí theo P2, chờ quản lý xác nhận', true));
      if (!rooms.length) notices.push('Hết phòng trống cùng hạng ' + typeName(baseType) + '.');
      if (wantUp && target && rank(target) > rank(baseType)) {
        const ups = vacant(target, 1);
        ups.forEach((r) => opt('B · nâng hạng', r, calcFee(baseType, target, n), 'Có phí theo P3; miễn phần chênh chỉ khi quản lý duyệt'));
        if (!ups.length) notices.push('Phương án B — hết phòng hạng ' + typeName(target) + '.');
      } else if (wantUp) {
        notices.push('Đổi cùng hạng đã đặt có phí 0 đ theo P2, chờ quản lý xác nhận. Nếu khách chọn hạng cao hơn, áp dụng phí chênh theo P3; miễn phần chênh cần quản lý duyệt theo P4.');
      }
      if (mismatch) notices.push('Phát hiện: phòng đang ở (' + typeName(cur) + ') khác hạng đã đặt (' + typeName(booked) + ').');
    } else if (wantUp && target && rank(target) > rank(cur)) {
      topics = ['nang_hang'];
      title = 'Nâng từ ' + typeName(cur) + ' lên ' + typeName(target);
      const rooms = vacant(target);
      if (rooms.length) {
        rooms.forEach((r) => opt('Nâng hạng', r, calcFee(cur, target, n), 'Lễ tân tự duyệt theo P3'));
      } else {
        kind = 'soldout'; label = 'Hết phòng'; title = 'Hết ' + typeName(target);
        notices.push('Không còn phòng ' + typeName(target) + ' theo dữ liệu hiện tại.');
        const alt = bestAlternative(cur, target, booking.room, trace);
        alt.forEach((r) => opt('Phương án gần nhất', r, calcFee(cur, r.type, n), 'Hạng gần nhất còn trống'));
        if (alt.length) title += ' · đề xuất ' + typeName(alt[0].type);
        else notices.push('Cũng không có hạng cao hơn nào còn trống.');
      }
    } else {
      title = 'Đổi sang phòng ' + typeName(cur) + ' khác';
      const rooms = vacant(cur);
      if (rooms.length) rooms.forEach((r) => opt('Đổi cùng hạng', r, calcFee(cur, cur, n), 'Lễ tân tự duyệt theo P1'));
      else { kind = 'soldout'; label = 'Hết phòng'; title = 'Hết phòng trống cùng hạng'; notices.push('Không còn phòng trống cùng hạng ' + typeName(cur) + '.'); }
    }

    const policies = getPolicy(topics);
    trace.push({ tool: 'get_policy', args: topics.join(', '), out: policies.map((p) => p.code).join(', ') });

    let draft;
    if (kind === 'manager') {
      draft = u.wants_refund_or_free
        ? 'Dạ, lễ tân đã ghi nhận đề nghị của quý khách và chuyển quản lý ca xem xét. Lễ tân chưa thể cam kết hoàn tiền hay ưu đãi; quản lý ca sẽ phản hồi quý khách sớm nhất ạ.'
        : 'Dạ, lễ tân rất tiếc về sự cố quý khách gặp phải. Quản lý ca đã xác nhận; quý khách được đổi sang phòng cùng hạng không tính phí' +
          (options.some((o) => !o.free) ? ', hoặc có thể nâng hạng với phí như bên dưới' : '') + '. Quý khách chọn giúp lễ tân phương án phù hợp ạ.';
    } else if (options.length) {
      draft = (kind === 'soldout' ? 'Dạ, rất tiếc hạng quý khách chọn hiện đã hết phòng. Lễ tân xin gửi phương án gần nhất bên dưới, ' : 'Dạ, lễ tân đã kiểm tra đặt phòng ' + booking.id + ' của quý khách. Hiện có phương án phù hợp bên dưới, ') +
        'phí đã tính theo ' + n + ' đêm còn lại. Quý khách chọn phương án mong muốn, lễ tân sẽ hỗ trợ chuyển phòng ngay ạ.';
    } else {
      draft = 'Dạ, rất tiếc hiện chưa còn phòng phù hợp. Lễ tân sẽ báo ngay cho quý khách khi có phòng trống ạ.';
    }

    return Object.assign(base, { kind, label, title, options, notices, reasons, policies, draft,
      ticket: ticket ? 'Phòng ' + booking.room + ' đang có phiếu sự cố (' + (ticket.by === 'hotel' ? 'lỗi do khách sạn' : 'chưa rõ nguyên nhân') + ').' : '' });
  }

  window.Engine = {
    H, typeName, rate, rank, vnd, fmtDate, getBooking, findVacantRooms, calcFee, getPolicy,
    rules, extractRef, decide, INCIDENT, REQUEST, ORDER
  };
})();
