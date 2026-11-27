/**
 * Tạo Google Form khảo sát lễ tân (Track C · C2) + Google Sheet nhận kết quả.
 * Bộ câu hỏi khớp evidence/survey/questions.md — sửa thì sửa cả hai.
 *
 * Cách chạy:
 *   1. Mở https://script.google.com → New project → dán toàn bộ file này.
 *   2. Chọn hàm createSurvey → Run → cấp quyền (Forms, Sheets).
 *   3. Xem View → Logs (hoặc Execution log): link form để gửi, link sửa, link sheet.
 * Chạy lại sẽ tạo form MỚI; không cần chạy nhiều lần.
 */
function createSurvey() {
  var NAV = FormApp.PageNavigationType;

  var form = FormApp.create('Khảo sát lễ tân: khách đang ở xin đổi / nâng hạng phòng');
  form
    .setDescription(
      'Nhóm sinh viên đang tìm hiểu cách lễ tân xử lý khi khách ĐANG LƯU TRÚ xin đổi phòng ' +
      'hoặc nâng hạng phòng. Khoảng 3 phút, 10 câu, hỏi về lần gần nhất bạn gặp. ' +
      'Form KHÔNG thu tên, email hay tên khách sạn. Kết quả chỉ dùng cho bài hackathon.'
    )
    .setCollectEmail(false)
    .setProgressBar(true)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage('Cảm ơn bạn đã dành thời gian!');

  // ---- Trang 1: sàng lọc ----
  var q1 = form.addMultipleChoiceItem()
    .setTitle('1. Công việc hiện tại của bạn là gì?')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. Nơi bạn làm (hoặc làm gần nhất) thuộc loại nào?')
    .setChoiceValues([
      'Khách sạn 3 sao trở xuống',
      'Khách sạn 4–5 sao',
      'Resort',
      'Homestay / căn hộ dịch vụ'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ---- Trang 2: lần gần nhất ----
  form.addPageBreakItem().setTitle('Lần gần nhất');
  var q3 = form.addMultipleChoiceItem()
    .setTitle('3. Lần gần nhất có KHÁCH ĐANG LƯU TRÚ xin đổi phòng hoặc nâng hạng phòng tại quầy của bạn là khi nào?')
    .setRequired(true);

  // ---- Trang 3: kể lại lần đó ----
  form.addPageBreakItem()
    .setTitle('Kể lại lần gần nhất đó')
    .setHelpText('Các câu dưới đây đều hỏi về đúng lần gần nhất bạn vừa nghĩ tới.');

  form.addTextItem()
    .setTitle('4. Trong 1 tuần làm việc gần nhất, bạn nhận khoảng bao nhiêu yêu cầu đổi / nâng hạng như vậy?')
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Nhập một số nguyên, vd 0, 3, 10')
      .requireWholeNumber()
      .build())
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('5. Lần gần nhất đó, để trả lời khách bạn đã phải xem / hỏi những gì?')
    .setHelpText('Chọn tất cả những gì bạn đã dùng.')
    .setChoiceValues([
      'Phần mềm quản lý khách sạn (PMS)',
      'Bảng giá / file Excel',
      'Văn bản chính sách đổi – nâng hạng',
      'Hỏi buồng phòng về tình trạng phòng',
      'Hỏi quản lý ca',
      'Hỏi đồng nghiệp',
      'Nhóm chat nội bộ (Zalo, Messenger…)',
      'Tự nhớ, không cần tra'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. Lần đó, từ lúc khách yêu cầu đến lúc bạn báo được phương án (phòng + phí) mất khoảng bao lâu?')
    .setChoiceValues(['Dưới 5 phút', '5–15 phút', '15–30 phút', 'Trên 30 phút'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('7. Kết quả của lần đó?')
    .setChoiceValues([
      'Giải quyết ngay tại quầy',
      'Phải chờ quản lý duyệt',
      'Khách phải chờ / quay lại sau',
      'Không đáp ứng được'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('8. Trong 1 tháng qua, ở quầy của bạn (bạn hoặc đồng nghiệp) có lần nào báo khách SAI PHÍ CHÊNH hoặc SAI TÌNH TRẠNG PHÒNG rồi phải sửa lại không?')
    .setChoiceValues(['Có, 1 lần', 'Có, từ 2 lần', 'Không', 'Không nhớ'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('9. Điều gì khó chịu hoặc mất thời gian nhất ở lần gần nhất đó?')
    .setHelpText('Kể ngắn gọn chuyện đã xảy ra, không cần nêu tên khách sạn hay khách.')
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
    q1.createChoice('Lễ tân (đang làm)', NAV.CONTINUE),
    q1.createChoice('Trưởng ca / quản lý ca tiền sảnh', NAV.CONTINUE),
    q1.createChoice('Từng làm lễ tân trong 12 tháng qua', NAV.CONTINUE),
    q1.createChoice('Khác (không làm lễ tân)', NAV.SUBMIT)
  ]);
  q3.setChoices([
    q3.createChoice('Hôm nay', NAV.CONTINUE),
    q3.createChoice('Trong tuần này', NAV.CONTINUE),
    q3.createChoice('Tuần trước', NAV.CONTINUE),
    q3.createChoice('Trong tháng này', NAV.CONTINUE),
    q3.createChoice('Lâu hơn 1 tháng', NAV.CONTINUE),
    q3.createChoice('Chưa bao giờ', NAV.SUBMIT)
  ]);

  // ---- Sheet nhận kết quả ----
  var sheet = SpreadsheetApp.create('Kết quả — Khảo sát lễ tân đổi / nâng hạng phòng');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Link gửi người trả lời: ' + form.getPublishedUrl());
  Logger.log('Link sửa form:          ' + form.getEditUrl());
  Logger.log('Link sheet kết quả:     ' + sheet.getUrl());
}
