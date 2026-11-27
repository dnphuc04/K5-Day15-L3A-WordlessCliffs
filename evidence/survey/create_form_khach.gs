/**
 * Tạo Google Form khảo sát KHÁCH (Track C · C2) + Google Sheet nhận kết quả.
 * Bộ câu hỏi khớp evidence/survey/questions-khach.md — sửa thì sửa cả hai.
 *
 * Cách chạy:
 *   1. Mở https://script.google.com → New project → dán toàn bộ file này.
 *      (Có thể dán chung project với create_form.gs — tên hàm khác nhau.)
 *   2. Chọn hàm createGuestSurvey → Run → cấp quyền (Forms, Sheets).
 *   3. Xem Execution log: link form để gửi, link sửa, link sheet.
 * Chạy lại sẽ tạo form MỚI; không cần chạy nhiều lần.
 */
function createGuestSurvey() {
  var NAV = FormApp.PageNavigationType;

  var form = FormApp.create('Khảo sát khách: đổi / nâng hạng phòng khi đang lưu trú');
  form
    .setDescription(
      'Nhóm sinh viên đang tìm hiểu trải nghiệm của khách khi muốn đổi phòng hoặc nâng hạng phòng ' +
      'trong lúc đang ở khách sạn / resort. Khoảng 3 phút, hỏi về lần gần nhất bạn gặp. ' +
      'Form KHÔNG thu tên, email hay tên khách sạn. Kết quả chỉ dùng cho bài hackathon.'
    )
    .setCollectEmail(false)
    .setProgressBar(true)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage('Cảm ơn bạn đã dành thời gian!');

  // ---- Trang 1: sàng lọc ----
  var q1 = form.addMultipleChoiceItem()
    .setTitle('1. Trong 12 tháng qua, bạn đã ở khách sạn / resort bao nhiêu lần?')
    .setRequired(true);

  // ---- Trang 2: có nhu cầu không ----
  form.addPageBreakItem().setTitle('Đổi / nâng hạng phòng');
  var q2 = form.addMultipleChoiceItem()
    .setTitle('2. Trong 12 tháng qua, có lần nào khi ĐANG LƯU TRÚ bạn muốn đổi phòng hoặc nâng hạng phòng không?')
    .setRequired(true);

  // ---- Trang 2b: muốn nhưng không đề nghị ----
  var page2b = form.addPageBreakItem().setTitle('Vì sao không đề nghị');
  form.addCheckboxItem()
    .setTitle('2b. Vì sao bạn không đề nghị với khách sạn?')
    .setHelpText('Chọn tất cả lý do đúng với bạn.')
    .setChoiceValues([
      'Không rõ phí, sợ đắt',
      'Ngại làm phiền',
      'Nghĩ sẽ phải chờ lâu',
      'Nghĩ đã hết phòng',
      'Không biết là có thể đề nghị'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ---- Trang 3: kể lại lần đó ----
  var page3 = form.addPageBreakItem()
    .setTitle('Kể lại lần gần nhất')
    .setHelpText('Các câu dưới đây đều hỏi về đúng lần gần nhất bạn đã đề nghị đổi / nâng hạng phòng.');

  form.addCheckboxItem()
    .setTitle('3. Lần gần nhất, lý do bạn muốn đổi / nâng hạng là gì?')
    .setChoiceValues([
      'Sự cố trong phòng (ồn, hỏng, bẩn)',
      'Phòng không giống mô tả / ảnh',
      'Muốn phòng rộng hơn / view đẹp hơn',
      'Thay đổi số người ở'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('4. Bạn đề nghị bằng cách nào?')
    .setChoiceValues(['Ra quầy lễ tân', 'Gọi điện từ phòng', 'Nhắn tin (app, OTA, Zalo…)'])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('5. Từ lúc đề nghị đến lúc được báo phương án (phòng nào, phí bao nhiêu) mất khoảng bao lâu?')
    .setChoiceValues([
      'Dưới 5 phút',
      '5–15 phút',
      '15–30 phút',
      '30 phút – 2 giờ',
      'Trên 2 giờ / hôm sau',
      'Không được báo'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. Phí chênh (nếu có) được báo thế nào?')
    .setChoiceValues([
      'Báo rõ trước khi tôi đồng ý',
      'Có báo nhưng không rõ cách tính',
      'Chỉ biết khi thanh toán',
      'Được miễn phí',
      'Không nhớ'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('7. Sau khi đã được báo, phí hoặc phòng có bị THAY ĐỔI LẠI không?')
    .setChoiceValues([
      'Có, phí khác với lúc báo',
      'Có, phòng khác / hoá ra không còn phòng',
      'Không',
      'Không nhớ'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('8. Kết quả cuối cùng?')
    .setChoiceValues([
      'Được đổi đúng như mong muốn',
      'Được phương án khác, chấp nhận được',
      'Không được đổi',
      'Tôi bỏ, không đổi nữa'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('9. Điều gì khó chịu hoặc mất thời gian nhất ở lần đó?')
    .setHelpText('Kể ngắn gọn chuyện đã xảy ra, không cần nêu tên khách sạn.')
    .setRequired(false);

  // ---- Trang 4: liên hệ (tuỳ chọn) ----
  form.addPageBreakItem().setTitle('Hỏi thêm (tuỳ chọn)');
  form.addMultipleChoiceItem()
    .setTitle('10. Bạn có sẵn lòng cho nhóm hỏi thêm 10 phút không?')
    .setChoiceValues(['Có', 'Không'])
    .setRequired(false);
  form.addTextItem()
    .setTitle('Nếu có: cách liên hệ (SĐT / Zalo / email) — không bắt buộc')
    .setRequired(false);

  // ---- Rẽ nhánh (đặt sau khi các trang đã tồn tại) ----
  q1.setChoices([
    q1.createChoice('Chưa lần nào', NAV.SUBMIT),
    q1.createChoice('1 lần', NAV.CONTINUE),
    q1.createChoice('2–3 lần', NAV.CONTINUE),
    q1.createChoice('Từ 4 lần', NAV.CONTINUE)
  ]);
  q2.setChoices([
    q2.createChoice('Có, và đã đề nghị với khách sạn', page3),
    q2.createChoice('Có, nhưng không đề nghị', page2b),
    q2.createChoice('Không', NAV.SUBMIT)
  ]);
  // Hết trang 2b thì nộp luôn, không đi tiếp vào trang 3.
  // (Điều hướng "sau trang X" đặt trên page break ngay sau X. Người chọn
  //  "đã đề nghị" nhảy thẳng tới page3 qua câu 2 nên không bị ảnh hưởng.)
  page3.setGoToPage(NAV.SUBMIT);

  // ---- Sheet nhận kết quả ----
  var sheet = SpreadsheetApp.create('Kết quả — Khảo sát khách đổi / nâng hạng phòng');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Link gửi người trả lời: ' + form.getPublishedUrl());
  Logger.log('Link sửa form:          ' + form.getEditUrl());
  Logger.log('Link sheet kết quả:     ' + sheet.getUrl());
}
