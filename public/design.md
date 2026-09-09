# MATH HANDBOOK PRO
## Tài liệu thiết kế sản phẩm và triển khai

Ngày: 09/09/2026 · Ngôn ngữ: Tiếng Việt · Phiên bản bàn giao: 1.0

## 1. Mục tiêu và phạm vi

MATH HANDBOOK PRO là không gian học toán từ THCS, THPT đến đại học cơ bản. Hành trình chính là **tra công thức → hiểu điều kiện → đọc chứng minh và ví dụ → tự luyện → ôn lại → theo dõi tiến độ**.

Tài liệu TOAN.HTML được dùng làm nguồn tham chiếu cho cách trình bày công thức, ví dụ hằng đẳng thức, cấp số và số phức. Nội dung yêu cầu đính kèm được dùng làm bản mô tả sản phẩm. Các chỉ dẫn đóng vai trong tài liệu không được thực thi như yêu cầu vận hành hệ thống.

### Phạm vi đang có trong website

- 7 nhóm kiến thức, 43 thẻ bài học/công thức; mỗi thẻ có điều kiện, lý thuyết, chứng minh ngắn, ví dụ, lỗi thường gặp và bài tập có lời giải.
- 9 bất đẳng thức: AM–GM, Cauchy–Schwarz, Jensen, Hölder, Minkowski, Chebyshev, Schur bậc ba, Bernoulli, Nesbitt. Có dấu bằng và bài dạng Olympic kèm lập luận; không gắn nhãn là đề thi Olympic có thật.
- Tìm kiếm tiếng Việt có/không dấu; lọc chuyên đề; đánh dấu công thức yêu thích.
- Quiz chọn ngẫu nhiên tối đa 5 câu từ ngân hàng; trắc nghiệm, đúng/sai, điền số. Không phải bộ sinh vô hạn đề mới bằng AI.
- Flashcards đảo mặt; lịch ôn đơn giản: chưa nhớ sau 1 ngày, đã nhớ sau 3 ngày.
- Argand: kéo điểm, kéo nền để pan, zoom, nhập tọa độ, mô đun, góc chính, liên hợp.
- Euler: vòng tròn đơn vị, vector quay, chiếu sin/cos và đồ thị đồng bộ; có tạm dừng và chọn góc.
- Cấp số cộng/nhân: timeline, đồ thị các số hạng, tổng hữu hạn và tổng vô hạn có kiểm tra hội tụ.
- Giải tích: chọn x², x³, sin x, eˣ; xem f, f′ và F với C=0; tính tích phân xác định từ hai cận. Chưa có nhập biểu thức tùy ý hoặc hệ đại số máy tính tổng quát.
- Máy tính phương trình bậc hai có xử lý a=0, nghiệm thực/phức, hệ 2 ẩn, logarit và cấp số.
- Hồ sơ, lịch sử trả lời, mốc học tập, tiến độ và lịch ôn lưu trong cơ sở dữ liệu theo tài khoản.
- Trang AI Tutor và điểm kết nối API đã được viết. **Chưa bật AI** vì chưa có khóa và mô hình; không giả lập phản hồi AI.
- Giao diện sáng/tối, responsive và điều khiển bằng bàn phím cho các biểu mẫu. Các đồ thị có phần nhập số thay thế thao tác kéo.

Đây là bộ học liệu khởi đầu, không phải toàn bộ chương trình toán hoặc bản sao tính năng của Khan Academy, Brilliant hay Wolfram. Chưa có CMS, quản lý lớp học, chấm lời giải tự luận tự động có đảm bảo, hoặc kiểm duyệt bởi hội đồng chuyên môn.

### Kiến trúc được triển khai và kiến trúc mục tiêu

| Thành phần | Bản chạy trên Sites | Kiến trúc production được yêu cầu |
|---|---|---|
| Frontend | React 19 + Vinext, tương thích cấu trúc Next App Router; starter dùng Next 16 | Next.js 15 theo tài liệu, cần chốt phiên bản được hỗ trợ trước triển khai độc lập |
| UI | Tailwind + Shadcn/Radix + Lucide | Tailwind + Shadcn; có thể thêm Framer Motion cho chuyển cảnh |
| Ký hiệu toán | KaTeX cục bộ trong gói ứng dụng | KaTeX; MathJax chỉ khi cần tính năng chưa hỗ trợ |
| Đồ thị | SVG tương tác có state React | SVG cho Argand/Euler; Recharts thích hợp cho thống kê; không bắt buộc dùng cùng thư viện cho mọi đồ thị |
| Backend | Route handlers trên Cloudflare Workers | Node.js với lớp dịch vụ riêng |
| Database | D1/SQLite cho dữ liệu người học; nội dung có phiên bản trong mã nguồn | PostgreSQL cho nội dung, người dùng, lịch sử và phân quyền |
| Authentication | Danh tính ChatGPT do Sites cung cấp; site xuất bản riêng tư | Clerk cho website độc lập; cần cấu hình tài khoản và webhook |
| AI | Endpoint server Responses API; chưa cấu hình | OpenAI API + đánh giá chất lượng, giới hạn chi phí và theo dõi lỗi |

Không coi các lựa chọn trong cột mục tiêu là dịch vụ đã được cài hoặc kết nối.

## 2. Site map

```text
/                         Tổng quan học tập
/topics                   Danh mục 7 nhóm kiến thức
/formulas                 Sổ tay + tìm kiếm + bộ lọc
/formulas?lesson=f1        Chi tiết bài học (ID từ thư viện)
/quiz                     Luyện tập và Quiz
/flashcards               Ôn công thức
/labs                     Argand / Euler / Cấp số / Giải tích
/calculator               Phương trình / Hệ 2 ẩn / Logarit / Cấp số
/mindmap                  Sơ đồ tư duy có nút mở bài
/tutor                    AI Tutor và học liệu liên quan
/profile                  Tiến độ, mốc học tập, lượt trả lời gần đây
/about                    Landing page giới thiệu và hướng dẫn học
/design                   Tài liệu thiết kế và tải bản Markdown
/api/progress             API dữ liệu học tập
/api/tutor                API trạng thái và hội thoại AI
```

Các route giao diện cùng dùng shell điều hướng và thiết kế thống nhất. Back/Forward của trình duyệt đồng bộ trang và bài đang mở. ID bài hiện có là f1–f43; khi bổ sung nội dung phải giữ ID cũ, không chèn làm dịch chuyển số thứ tự. Trước mở rộng CMS, đổi bộ khai báo ID thành hằng tường minh và giữ ánh xạ lịch sử.

## 3. User flows

### Học một công thức

1. Mở Tổng quan hoặc Sổ tay.
2. Nhập từ khóa, ví dụ “công thức tổng cấp số nhân”.
3. Chọn kết quả; xem công thức và điều kiện.
4. Tab Lý thuyết: bản chất, chứng minh, dấu bằng nếu có.
5. Tab Ví dụ & mẹo: ví dụ cơ bản, bài nâng cao, lỗi cần tránh.
6. Tab Tự luyện: nhập đáp án số và kiểm tra.
7. Đánh dấu đã hiểu để lưu vào hồ sơ; thiếu đăng nhập thì hiển thị yêu cầu đăng nhập, không báo lưu thành công.
8. Ôn lại bằng flashcards.

### Quiz

Chọn chuyên đề + dạng câu → tạo lượt ngẫu nhiên → chọn/nhập đáp án → kiểm tra và đọc lời giải → câu tiếp theo → tổng kết số đúng → lượt mới. Câu trả lời được chấm lại trên máy chủ khi lưu. ID lượt trả lời chống lưu trùng do retry. Lỗi mạng không xóa đáp án; người học có nút thử lưu lại.

### Flashcards

Chọn chuyên đề → tùy chọn chỉ thẻ đến hạn → tự nhớ → lật thẻ → chọn Cần ôn lại/Đã nhớ → lưu ngày đến hạn → chuyển thẻ. Nếu lưu thất bại, giữ thẻ hiện tại để thử lại. Bỏ qua thẻ không tạo bản ghi ôn.

### Khám phá hình học số phức

Mở /labs → chọn Mặt phẳng phức → kéo điểm tím hoặc nhập a,b → cập nhật z, |z|, góc và liên hợp → zoom/pan → đặt lại. Tại z=0, góc hiển thị không xác định.

### AI Tutor

Kiểm tra trạng thái máy chủ → nếu chưa cấu hình, giải thích rõ và cho tra học liệu → nếu đã cấu hình, người học đăng nhập, gửi câu hỏi → nhận trả lời → lưu lịch sử. Câu hỏi lỗi được giữ lại để gửi lại. Lịch sử hiển thị tối đa 20 hội thoại gần đây; ngữ cảnh gửi API giới hạn 4 lượt trước để kiểm soát kích thước.

## 4. Thiết kế học liệu

### Cấu trúc một thẻ bài học

```ts
type Formula = {
  id: string; topic: string; name: string; latex: string;
  condition: string; theory: string; proof: string;
  example: string; tip: string; mistake: string;
  question: string; answer: number; solution: string;
  equality?: string; advanced?: string;
};
```

Bài cơ bản cần tách định nghĩa và thao tác, dùng ít nhất một ví dụ có số cụ thể. Bài căn/lũy thừa phải nêu miền xác định. Bất đẳng thức phải nêu điều kiện, chiều, dấu bằng và lời giải bài nâng cao. Tích phân phải phân biệt diện tích có dấu và diện tích hình học. Số phức phải tách hệ đo góc độ/radian.

### Khung chương trình mở rộng

| Nhóm | Nội dung đã đưa vào | Bổ sung sau phản hồi |
|---|---|---|
| Đại số | 7 hằng đẳng thức theo nhóm, phân thức, đa thức, đồng nhất thức, phương trình, hệ, trị tuyệt đối, hàm số | Bài tập phân cấp, phương trình tham số, hàm số từng phần |
| Lũy thừa/căn | Quy tắc, căn 2/3/n, liên hợp | Căn lồng nhau, hữu tỉ hóa nhiều bước |
| Bất đẳng thức | 9 họ chính, điều kiện và ví dụ | Bộ bài chọn kỹ thuật, lời giải nhiều cách |
| Cấp số | Công sai/công bội, số hạng, tổng hữu hạn/vô hạn | Bài toán tài chính mô phỏng và truy hồi |
| Logarit | Định nghĩa, quy tắc, đổi cơ số, lg/ln | Phương trình và bất phương trình log |
| Số phức | Đại số, mô đun, liên hợp, argument, lượng giác, De Moivre, Euler | Căn phức bậc n, quỹ tích |
| Giải tích | Giới hạn, đạo hàm, hàm hợp, nguyên hàm, tích phân | Nhiều biến, chuỗi, kỹ thuật tích phân |

Mọi ví dụ và đáp án mới phải qua rà soát toán độc lập trước khi quảng bá như giáo trình hoàn chỉnh. Lưu tác giả, nguồn, người duyệt và phiên bản học liệu trong CMS mục tiêu.

## 5. Database schema mục tiêu — PostgreSQL

Schema logic gồm đủ 11 thực thể được yêu cầu và thực thể bổ trợ cho người dùng, lượt quiz, quan hệ thành tích. UUID tạo tại tầng ứng dụng; không cần extension bắt buộc.

```sql
CREATE TABLE app_user (
  id uuid PRIMARY KEY, clerk_id text UNIQUE NOT NULL,
  display_name text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE topic (
  id uuid PRIMARY KEY, slug text UNIQUE NOT NULL,
  title text NOT NULL, level text NOT NULL,
  description text NOT NULL, sort_order integer NOT NULL DEFAULT 0
);
CREATE TABLE lesson (
  id uuid PRIMARY KEY, topic_id uuid NOT NULL REFERENCES topic(id),
  slug text UNIQUE NOT NULL, title text NOT NULL,
  theory jsonb NOT NULL, proof jsonb NOT NULL,
  tips jsonb NOT NULL DEFAULT '[]', mistakes jsonb NOT NULL DEFAULT '[]',
  content_version integer NOT NULL DEFAULT 1,
  status text NOT NULL CHECK(status IN ('draft','review','published')),
  source_notes jsonb NOT NULL DEFAULT '[]', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE formula (
  id uuid PRIMARY KEY, lesson_id uuid NOT NULL REFERENCES lesson(id),
  title text NOT NULL, latex text NOT NULL, conditions jsonb NOT NULL,
  symbol_definitions jsonb NOT NULL, equality_conditions jsonb,
  search_text text NOT NULL, content_version integer NOT NULL DEFAULT 1
);
CREATE TABLE example (
  id uuid PRIMARY KEY, lesson_id uuid NOT NULL REFERENCES lesson(id),
  difficulty text NOT NULL CHECK(difficulty IN ('basic','advanced','olympic_style')),
  problem jsonb NOT NULL, solution_steps jsonb NOT NULL,
  provenance jsonb NOT NULL DEFAULT '{}'
);
CREATE TABLE exercise (
  id uuid PRIMARY KEY, lesson_id uuid NOT NULL REFERENCES lesson(id),
  type text NOT NULL CHECK(type IN ('mcq','true_false','numeric','written')),
  prompt jsonb NOT NULL, options jsonb,
  grading_spec jsonb NOT NULL, difficulty integer NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
  content_version integer NOT NULL DEFAULT 1
);
CREATE TABLE solution (
  id uuid PRIMARY KEY, exercise_id uuid NOT NULL REFERENCES exercise(id),
  method_name text NOT NULL, steps jsonb NOT NULL, final_answer jsonb NOT NULL
);
CREATE TABLE quiz (
  id uuid PRIMARY KEY, owner_id uuid NOT NULL REFERENCES app_user(id),
  topic_id uuid REFERENCES topic(id), seed text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE quiz_item (
  quiz_id uuid NOT NULL REFERENCES quiz(id), position integer NOT NULL,
  exercise_id uuid NOT NULL REFERENCES exercise(id), exercise_version integer NOT NULL,
  question_snapshot jsonb NOT NULL, PRIMARY KEY(quiz_id,position)
);
CREATE TABLE quiz_attempt (
  id uuid PRIMARY KEY, quiz_id uuid NOT NULL REFERENCES quiz(id),
  user_id uuid NOT NULL REFERENCES app_user(id),
  exercise_id uuid NOT NULL REFERENCES exercise(id),
  answer jsonb NOT NULL, correct boolean NOT NULL,
  idempotency_key uuid UNIQUE NOT NULL, submitted_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE flashcard (
  id uuid PRIMARY KEY, formula_id uuid NOT NULL REFERENCES formula(id),
  front jsonb NOT NULL, back jsonb NOT NULL
);
CREATE TABLE user_flashcard (
  user_id uuid NOT NULL REFERENCES app_user(id), flashcard_id uuid NOT NULL REFERENCES flashcard(id),
  due_at timestamptz NOT NULL, interval_days integer NOT NULL DEFAULT 1,
  reviews integer NOT NULL DEFAULT 0, PRIMARY KEY(user_id,flashcard_id)
);
CREATE TABLE ai_history (
  id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES app_user(id),
  conversation_id uuid NOT NULL, role text NOT NULL CHECK(role IN ('user','assistant')),
  content text NOT NULL, model text, usage jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE user_progress (
  user_id uuid NOT NULL REFERENCES app_user(id), lesson_id uuid NOT NULL REFERENCES lesson(id),
  completed boolean NOT NULL DEFAULT false, bookmarked boolean NOT NULL DEFAULT false,
  mastery numeric NOT NULL DEFAULT 0 CHECK(mastery BETWEEN 0 AND 1),
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,lesson_id)
);
CREATE TABLE achievement (
  id uuid PRIMARY KEY, code text UNIQUE NOT NULL,
  title text NOT NULL, criteria jsonb NOT NULL
);
CREATE TABLE user_achievement (
  user_id uuid NOT NULL REFERENCES app_user(id), achievement_id uuid NOT NULL REFERENCES achievement(id),
  earned_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,achievement_id)
);
CREATE INDEX idx_lesson_topic ON lesson(topic_id);
CREATE INDEX idx_formula_lesson ON formula(lesson_id);
CREATE INDEX idx_example_lesson ON example(lesson_id);
CREATE INDEX idx_exercise_lesson ON exercise(lesson_id);
CREATE INDEX idx_solution_exercise ON solution(exercise_id);
CREATE INDEX idx_quiz_owner ON quiz(owner_id,created_at DESC);
CREATE INDEX idx_attempt_user ON quiz_attempt(user_id,submitted_at DESC);
CREATE INDEX idx_flashcard_due ON user_flashcard(user_id,due_at);
CREATE INDEX idx_ai_user_conversation ON ai_history(user_id,conversation_id,created_at);
CREATE INDEX idx_formula_search ON formula USING gin(to_tsvector('simple',search_text));
```

Quyền truy cập phải được kiểm tra theo user_id tại mọi API, hoặc bổ sung row-level security khi dùng trực tiếp PostgreSQL với danh tính đã xác thực. Không cho trình duyệt truy cập grading_spec trước khi nộp ở chế độ kiểm tra chính thức. Chưa thực thi schema PostgreSQL này trên dịch vụ nào.

### Schema thực tế của bản Sites

- `user_progress`: khóa kép (user_id, formula_id), completed, bookmarked, reviewed, due_at, updated_at.
- `quiz_attempts`: ID UUID, user_id, formula_id, answer, correct, created_at; chỉ mục user/date.
- `ai_history`: ID UUID, user_id, question, answer, created_at; chỉ mục user/date.
- Topic/Lesson/Formula/Example/Exercise/Solution/Flashcard nằm trong dữ liệu có phiên bản `lib/content.ts`; mỗi Formula đồng thời là một bài ngắn.
- Achievement được tính từ tiến độ; chưa lưu một bảng thành tích độc lập. Điều kiện quiz dựa trên tối đa 500 lượt gần nhất hiện được tải.
- Migration do Drizzle sinh, lưu trong `drizzle/`. Không tạo bảng trong runtime handler.

## 6. API structure

### API đã triển khai

| Endpoint | Hành vi | Bảo vệ |
|---|---|---|
| GET /api/progress | Danh tính hiển thị, tiến độ, tối đa 500 lượt trả lời | Bắt buộc danh tính máy chủ |
| POST /api/progress | complete, bookmark, review, attempt | Kiểm tra origin, Zod, ID bài, chấm lại đáp án |
| GET /api/tutor | configured, lịch sử 20 lượt, trạng thái lỗi lịch sử | Không trả khóa; lịch sử theo danh tính |
| POST /api/tutor | Gửi câu hỏi, nhận trả lời, lưu lịch sử | Danh tính, origin, tối đa 2 000 ký tự, timeout 45 giây |

Ví dụ ghi tiến độ:

```json
{"action":"complete","formulaId":"f1","value":true}
```

Ví dụ lưu câu trả lời:

```json
{"action":"attempt","formulaId":"f1","answer":169,"attemptId":"UUID-v4-cua-luot-tra-loi"}
```

Máy chủ dùng sai số tuyệt đối < 1e-7 cho ngân hàng đáp án số hiện tại. Đây không phải bộ so sánh biểu thức đại số tổng quát. `attemptId` được giữ khi retry để tránh đếm trùng. Các cột SQL thay đổi chỉ lấy từ allowlist nội bộ; dữ liệu đều bind qua prepared statements.

Mã lỗi chính: 400 dữ liệu sai, 401 chưa đăng nhập, 403 origin sai, 429 giới hạn AI, 502 lỗi dịch vụ AI, 503 dữ liệu/kết nối tạm không sẵn sàng. Client giữ bài làm khi lỗi.

### API mục tiêu cho triển khai độc lập

```text
GET    /api/v1/topics
GET    /api/v1/topics/:slug/lessons
GET    /api/v1/lessons/:slug
GET    /api/v1/formulas?q=&topic=&cursor=
GET    /api/v1/formulas/:id
POST   /api/v1/quizzes                    tạo lượt và giữ phiên bản câu hỏi
GET    /api/v1/quizzes/:id
POST   /api/v1/quizzes/:id/answers        chấm máy chủ, khóa idempotency
GET    /api/v1/flashcards/due
POST   /api/v1/flashcards/:id/reviews
GET    /api/v1/me/progress
PATCH  /api/v1/me/progress/:lessonId
GET    /api/v1/me/achievements
POST   /api/v1/tutor/messages
GET    /api/v1/tutor/conversations/:id
DELETE /api/v1/tutor/conversations/:id
POST   /api/v1/calculators/evaluate       whitelist phép toán
POST   /api/v1/webhooks/clerk             xác minh chữ ký webhook
```

API học liệu công khai chỉ trả nội dung published. Tạo/sửa nội dung yêu cầu vai trò editor; xuất bản yêu cầu reviewer/admin. Cursor pagination và giới hạn payload phải được áp dụng trước khi mở rộng ngân hàng.

## 7. Folder structure và mã nguồn bàn giao

```text
app/
  page.tsx                     Điểm vào dashboard
  [section]/page.tsx            Các trang chức năng và kiểm tra route
  layout.tsx                   Metadata và ngôn ngữ vi
  handbook.tsx                 Shell, điều hướng, tìm kiếm, hồ sơ, bản đồ, WebMCP
  overview.tsx                 Dashboard
  learning.tsx                 FormulaCard, Lesson, Quiz, Flashcards, TopicSelect
  labs.tsx                     Argand, Euler, Sequence, Calculus, máy tính
  math.tsx                     MathFormula với KaTeX
  tutor.tsx                    Giao diện AI và trạng thái chưa kết nối
  globals.css                  Theme, responsive, thành phần giao diện
  chatgpt-auth.ts              Danh tính do Sites chuyển tiếp
  api/progress/route.ts
  api/tutor/route.ts
lib/
  content.ts                   43 bài học và tìm kiếm tiếng Việt
  server.ts                    D1 helper, origin check
components/ui/                 Các primitive Shadcn có sẵn
 db/schema.ts                  Schema D1
 drizzle/                      Migration và metadata
public/
  favicon.svg
  design.md                    Tài liệu này
.openai/hosting.json            Site ID và binding DB
.env.example                   Tên biến môi trường, không chứa khóa
```

Mã nguồn React thực tế là hiện thực của UI Components và React Components trong yêu cầu, không chỉ ảnh mẫu. Gói nguồn ZIP bàn giao được tạo từ bản nguồn đã kiểm tra, không chứa node_modules, khóa, dữ liệu tài khoản hoặc tệp tạm.

## 8. UI Components và design system

- Nền sáng #F6F8FC, mặt nội dung trắng, chữ xanh đen #1C2945; tím xanh #555CE5 làm màu hành động.
- Nền tối #101726, card #182238, chữ #EDF1FC, tím nhạt #A5A7FF.
- Hero giáo dục dùng gradient xanh tím; các đồ thị là thành phần có ý nghĩa toán học, không phải ảnh minh họa trang trí.
- Body 16px; phần lớn nhãn 14px; metadata 12px. Chữ thương hiệu nhỏ hơn chỉ đóng vai trò logo.
- Sidebar trái trên desktop, Sheet có nút mở trên mobile. Header gọn, không che diện tích học tập.
- Reuse primitives: Sidebar, Tabs, Select, Slider, Tooltip, Switch, Progress và Sonner. Các biểu đồ là SVG có văn bản và kết quả số thay thế.
- CTA chính: “Khám phá”, “Kiểm tra”, “Đánh dấu đã hiểu”. Hành động lưu chỉ thông báo thành công sau khi máy chủ chấp nhận.
- UI có trạng thái loading, chưa đăng nhập, không có kết quả, chưa có dữ liệu, lỗi lưu và AI chưa kết nối.
- Theme là sở thích thiết bị nên có thể dùng localStorage. Tiến độ và kết quả không lấy localStorage làm nguồn dữ liệu chính.

## 9. Dashboard và Landing page

Dashboard mở ngay trên hoạt động học: ô tìm kiếm, thẻ số phức tương tác dẫn tới lab, công thức đại số và chuyên đề. Không buộc người học đi qua trang quảng cáo trước khi học.

Landing /about giải thích giá trị sản phẩm, số lượng học liệu có thật, vòng học ngắn và CTA tới chuyên đề/lab. Không có chứng thực, số người dùng hoặc kết quả học tập hư cấu.

## 10. Trang chuyên đề và công thức

Danh mục hiển thị trình độ định hướng, biểu thức đại diện, nội dung và tiến độ. Một số chuyên đề có phần nâng cao vượt cấp học ghi trên nhãn; nhãn là điểm bắt đầu, không phải giới hạn nội dung.

Trang công thức có search, lọc topic và công thức đã lưu. Card nêu tên, công thức, bản chất; chi tiết mở ba tab Lý thuyết, Ví dụ & mẹo, Tự luyện. Công thức dài được cuộn ngang trong khung, không kéo tràn toàn trang.

## 11. Quiz, Flashcards và Hồ sơ

Quiz dùng ngân hàng hiện có với lời giải xác định, giao diện phản hồi nhẹ nhàng. Sau khi kiểm tra, khóa đáp án câu đó; chỉ chuyển câu khi người học chọn. Dạng đúng/sai được tạo bằng một đáp án được giữ nguyên hoặc thay đổi, sau đó ánh xạ về đáp án số để chấm cùng quy tắc.

Flashcards đang dùng lịch ôn 1/3 ngày đơn giản. Production nên dùng một thuật toán lặp lại ngắt quãng được phiên bản hóa, chẳng hạn FSRS sau khi có tiêu chí kiểm định phù hợp; đây là hướng mở rộng, chưa có trong sản phẩm hiện tại.

Hồ sơ hiển thị bài đã hiểu, số công thức lưu, lượt trả lời gần đây, lượt ôn thẻ, tiến độ theo chuyên đề và cột mốc. Trạng thái “đã hiểu” là tự đánh giá của người học, không tương đương năng lực được kiểm định.

## 12. AI Tutor — cấu hình và hành vi

Biến môi trường:

```text
OPENAI_API_KEY=<secret ở server>
OPENAI_MODEL=<model ID được tài khoản hỗ trợ>
```

Không đặt khóa vào NEXT_PUBLIC_*, mã frontend, tài liệu hay Git. Sites lưu runtime secrets; không có khóa nào được tạo trong lần bàn giao này. Khi có kết nối, backend gọi Responses API ở server, đặt store=false cho phía API và lưu lịch sử riêng trong D1. Client hiển thị thông báo về việc gửi câu hỏi và lưu lịch sử.

Prompt định hướng giải toán bằng tiếng Việt, hỏi khi thiếu dữ kiện, phân biệt điều kiện và không bịa nguồn. Bổ sung tối đa 3 thẻ học liệu liên quan; thẻ học liệu là dữ liệu tham khảo, không có quyền thay đổi chỉ dẫn hệ thống.

Hiện có giới hạn 20 trả lời thành công trong một giờ/người, nhưng chưa có bộ đếm atomic chống gửi đồng thời. Trước mở rộng truy cập, cần rate limit atomic, ngân sách theo ngày, hạn mức token, xử lý moderation, quản lý/xóa hội thoại và bộ đánh giá chuyên môn. Chat AI chưa được kiểm thử end-to-end vì chưa cấu hình khóa.

Tài liệu tham chiếu API: [OpenAI Responses](https://developers.openai.com/api/reference/cli/resources/responses/methods/create).

## 13. Chất lượng, tính đúng và kiểm thử

Đã kiểm tra trong môi trường cục bộ:

- Kiểm tra TypeScript toàn bộ mã ứng dụng.
- Biên dịch đủ frontend và Worker.
- 12 route giao diện trả HTTP 200.
- 43 chuỗi công thức qua KaTeX ở chế độ báo lỗi nghiêm ngặt.
- Các trường học liệu bắt buộc, ID không trùng, 9 bất đẳng thức có dấu bằng và bài nâng cao.
- Tìm kiếm tiếng Việt “công thức tổng cấp số nhân” trả đúng nhóm tổng hữu hạn/vô hạn.
- API: chưa đăng nhập bị từ chối, input sai bị từ chối, lưu tiến độ/bookmark/review, chấm đúng/sai trên máy chủ, retry không thêm lượt trùng, origin khác bị từ chối.
- Trạng thái AI chưa cấu hình được trả rõ ràng.

Chưa thực hiện kiểm thử thao tác/ảnh chụp trên trình duyệt vì không có yêu cầu browser testing. Chưa kiểm định đầy đủ khả năng tiếp cận bằng screen reader và thiết bị thật. WebMCP có feature detection, hai tool `find_math_formulas` và `open_math_lesson`, cleanup bằng AbortSignal; chưa có môi trường xác nhận WebMCP nên không tuyên bố đã kiểm thử chúng.

Bản app không có eval hoặc new Function để chạy biểu thức người dùng. Các máy tính dùng biểu thức và hàm whitelist. Tính số có giới hạn hiển thị, không thay thế chứng minh hoặc tính chính xác tùy ý.

### Bộ kiểm thử production cần bổ sung

1. Unit tests cho quy tắc chấm điểm, lịch ôn và phép toán biên.
2. Integration tests với danh tính thật, phân quyền chéo người dùng, retry và mất kết nối.
3. Playwright kiểm tra các luồng chính trên desktop/mobile, focus, bàn phím, 200% zoom, light/dark.
4. Rà soát nội dung toán học độc lập, nguồn, bản quyền và phiên bản bài học.
5. Kiểm tra tải, kích thước bundle, lazy loading các module lab/KaTeX khi cần.
6. AI evals: sai điều kiện, nhầm dấu, đầu vào thiếu dữ kiện, học sinh gửi lời giải sai, prompt injection trong nội dung.
7. Khôi phục dữ liệu từ backup và migration rollback theo phiên bản.

Nguồn đối chiếu toán: [Cauchy–Schwarz — Wolfram MathWorld](https://mathworld.wolfram.com/Cauchy-SchwarzInequality.html), [Schur — Queen’s College](https://qc.edu.hk/math/Resource/AL/Schur%20inequality.pdf). Các chứng minh và ví dụ trong bộ học liệu được viết lại riêng, không sao chép nguyên văn giáo trình.

## 14. Roadmap triển khai production

### Giai đoạn A — Chốt học liệu và nhu cầu

- Chốt chương trình, cấp lớp và tiêu chí “cơ bản/nâng cao”.
- Hội đồng chuyên môn duyệt 43 bài đầu; mở rộng mỗi bài thành bộ 5–20 bài tập phân cấp.
- Chốt giao diện bằng thử nghiệm trực tiếp với học sinh, giáo viên; không chỉ dựa trên dashboard đẹp.
- Khóa ID nội dung để không phá tiến độ cũ.

Điều kiện hoàn thành: bài có người duyệt, đáp án kiểm tra độc lập, các luồng học được người dùng thực hiện thành công.

### Giai đoạn B — Nền tảng độc lập

- Chọn phiên bản framework được hỗ trợ và nhà cung cấp PostgreSQL; dùng schema mục tiêu, migrations và môi trường staging.
- Cấu hình Clerk, xác minh webhook, đồng bộ user và mapping với dữ liệu Sites nếu di chuyển.
- Tách content service, quiz service, progress service và tutor service.
- Có CMS nội dung với draft/review/published và audit log.

Điều kiện hoàn thành: auth thật hoạt động, phân quyền qua kiểm thử, migration có kiểm chứng, backup và restore chạy được.

### Giai đoạn C — Học tập thông minh

- Tăng ngân hàng câu hỏi, thiết kế tham số sinh đề có miền hợp lệ, giữ snapshot phiên bản.
- Áp dụng lịch ôn có dữ liệu; đo thời gian và tỉ lệ nhớ với sự đồng ý phù hợp.
- Kết nối AI Tutor, bộ evals chuyên môn, giới hạn chi phí và cơ chế báo lỗi nội dung.
- Cân nhắc hệ đại số máy tính để kiểm tra tương đương biểu thức; không dùng AI làm nguồn chấm điểm duy nhất.

Điều kiện hoàn thành: chất lượng đáp án đạt ngưỡng do nhóm chuyên môn quy định, chi phí không vượt hạn mức và mọi kết quả có thể truy vết.

### Giai đoạn D — Mở rộng và vận hành

- Kiểm thử đa thiết bị, a11y, bảo mật, theo dõi lỗi và hiệu năng.
- Quản lý dữ liệu học sinh, chính sách lưu/xóa, vai trò giáo viên/phụ huynh nếu cần.
- Theo dõi lesson completion, lỗi thường gặp, retention có chú ý quyền riêng tư.
- Chỉ mở công khai sau khi chủ trang chọn phạm vi người dùng và hoàn tất các tiêu chí trên.

Không ấn định ngày/cost production khi chưa biết nhóm thực hiện, ngân hàng học liệu, lưu lượng và gói dịch vụ.

## 15. Hướng dẫn bàn giao

1. Mở URL Sites để sử dụng bản hiện tại; quyền truy cập riêng tư theo chủ sở hữu.
2. Học liệu và công cụ hoạt động độc lập với AI Tutor.
3. Các hành động lưu tiến độ cần danh tính tài khoản. Production không dùng dữ liệu thử ở môi trường cục bộ.
4. Tải tài liệu thiết kế từ /design hoặc bản Markdown kèm theo.
5. Gói ZIP nguồn chứa mã React, schema D1, migrations và tài liệu; cài dependency theo package-lock nếu phát triển độc lập.
6. Để bật AI, cấu hình khóa server và model ID; sau đó kiểm thử API thực và theo dõi ngân sách.
7. Kiến trúc PostgreSQL/Clerk là kế hoạch có thể triển khai tiếp, chưa phải dịch vụ đang chạy trong bản Sites.
