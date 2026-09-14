'use client';
import {useState} from 'react';
import {
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Network,
  HelpCircle,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
  Boxes,
  PieChart,
  Box,
  Binary,
  Scale,
  Calculator,
} from 'lucide-react';
import {topics, formulas} from '@/lib/content';
import {MathFormula, MathText} from './math';

interface PrerequisiteStep {
  level: number;
  grade: string;
  name: string;
  formulaLatex: string;
  whyNeeded: string;
  keyConcepts: string[];
  recommendedFormulaIds: {id: string; title: string}[];
}

interface PrerequisiteTrack {
  id: string;
  icon: any;
  title: string;
  badge: string;
  goal: string;
  coreQuestion: string;
  flowchain: string[];
  whySequenceMatters: string;
  stuckTrapIfSkipped: string;
  steps: PrerequisiteStep[];
}

const PREREQUISITE_TRACKS: PrerequisiteTrack[] = [
  {
    id: 'calculus-integrals',
    icon: TrendingUp,
    title: 'Giải tích & Tích phân',
    badge: 'VÍ DỤ TRỌNG TÂM',
    goal: 'Tính diện tích hình thang cong, thể tích khối tròn xoay, giải phương trình vi phân và tìm quãng đường từ vận tốc s(t) = ∫ v(t) dt.',
    coreQuestion: 'Muốn học Tích phân thì nên vững nền tảng nào trước?',
    flowchain: [
      '1. Đại số & Phân thức',
      '2. Lũy thừa & Căn thức',
      '3. Hàm số & Lượng giác',
      '4. Giới hạn (Lim)',
      '5. Đạo hàm & Vi phân',
      '🎯 ĐÍCH ĐẾN: TÍCH PHÂN',
    ],
    whySequenceMatters:
      'Tích phân là phép toán đảo ngược của Đạo hàm, đồng thời là giới hạn của tổng diện tích vi phân. Muốn tìm nguyên hàm thì phải thuộc đạo hàm; muốn đổi biến số (tính du = u\'(x)dx) hay tích phân từng phần (∫ u dv) thì bắt buộc phải thành thạo vi phân; muốn tính tích phân phân thức hay lượng giác thì phải vững đại số và công thức nhân đôi/hạ bậc.',
    stuckTrapIfSkipped:
      'Nếu nhảy cóc học tích phân ngay, bạn sẽ học vẹt công thức mà không hiểu bản chất, không biết tại sao phải đặt ẩn phụ hay chọn u và dv, lúng túng khi gặp tích phân phân thức hữu tỉ vì không biết phân tích mẫu số, và bế tắc hoàn toàn trước các bài toán biến đổi lượng giác.',
    steps: [
      {
        level: 1,
        grade: 'Nền tảng 1 · THCS & Lớp 10',
        name: 'Biến đổi Đại số & Phân thức đại số',
        formulaLatex: '\\frac{P(x)}{Q(x)} = A + \\frac{B}{x - x_1} + \\frac{C}{x - x_2}',
        whyNeeded:
          'Cần thiết để giải quyết tích phân các hàm phân thức hữu tỉ bằng phương pháp đồng nhất hệ số và tách phân số đơn giản.',
        keyConcepts: [
          '7 hằng đẳng thức đáng nhớ',
          'Phân tích đa thức thành nhân tử',
          'Chia đa thức và đồng nhất hệ số',
          'Quy đồng & rút gọn phân thức',
        ],
        recommendedFormulaIds: [
          {id: 'f1', title: 'Hằng đẳng thức bậc hai'},
          {id: 'f3', title: 'Hiệu hai bình phương'},
          {id: 'f6', title: 'Phân thức đại số'},
        ],
      },
      {
        level: 2,
        grade: 'Nền tảng 2 · Lớp 9 - 11',
        name: 'Quy tắc Lũy thừa & Căn thức',
        formulaLatex: '\\sqrt[n]{x^m} = x^{m/n},\\quad \\frac{1}{x^n} = x^{-n}',
        whyNeeded:
          'Để áp dụng công thức nguyên hàm cơ bản ∫ x^α dx = x^(α+1)/(α+1), mọi biểu thức chứa căn hoặc nằm dưới mẫu đều phải chuyển về dạng lũy thừa số mũ thực.',
        keyConcepts: [
          'Lũy thừa với số mũ hữu tỉ',
          'Trục căn thức ở mẫu bằng lượng liên hợp',
          'Biến đổi căn lồng căn',
        ],
        recommendedFormulaIds: [
          {id: 'f14', title: 'Quy tắc lũy thừa'},
          {id: 'f15', title: 'Căn bậc hai'},
          {id: 'f18', title: 'Biến đổi căn thức & liên hợp'},
        ],
      },
      {
        level: 3,
        grade: 'Nền tảng 3 · Lớp 10 - 11',
        name: 'Hàm số & Biến đổi Lượng giác',
        formulaLatex: '\\sin^2 x = \\frac{1 - \\cos 2x}{2},\\quad \\cos^2 x = \\frac{1 + \\cos 2x}{2}',
        whyNeeded:
          'Tích phân lượng giác đòi hỏi hạ bậc lũy thừa chẵn của sin, cos hoặc biến đổi tích thành tổng trước khi tìm nguyên hàm.',
        keyConcepts: [
          'Đường tròn lượng giác & các góc đặc biệt',
          'Công thức cộng & nhân đôi',
          'Công thức hạ bậc và biến đổi tích thành tổng',
        ],
        recommendedFormulaIds: [
          {id: 'f13', title: 'Khái niệm Hàm số'},
          {id: 'geo-right-trig', title: 'Tỉ số lượng giác cơ bản'},
        ],
      },
      {
        level: 4,
        grade: 'Nền tảng 4 · Lớp 11',
        name: 'Giới hạn hàm số (Lim)',
        formulaLatex: '\\lim_{x \\to x_0} f(x),\\quad \\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*)\\,\\Delta x',
        whyNeeded:
          'Bản chất sâu sắc nhất của tích phân xác định chính là giới hạn của tổng Riemann khi chia nhỏ miền phẳng thành vô số dải vi phân vô cùng bé.',
        keyConcepts: [
          'Khái niệm giới hạn và vô cùng bé',
          'Giới hạn một bên và tính liên tục',
          'Định lý kẹp và giới hạn cơ bản',
        ],
        recommendedFormulaIds: [{id: 'f39', title: 'Giới hạn cơ bản'}],
      },
      {
        level: 5,
        grade: 'Nền tảng 5 · Lớp 11 (QUAN TRỌNG NHẤT)',
        name: 'Đạo hàm & Vi phân (Bắt buộc trước Tích phân)',
        formulaLatex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h},\\quad df = f\'(x)\\,dx',
        whyNeeded:
          'Tích phân là bài toán ngược của Đạo hàm (F\'(x) = f(x)). Nếu bạn không biết đạo hàm của ln(x) là 1/x hay của tan(x) là 1/cos²(x), bạn sẽ không thể tìm ra nguyên hàm hay nhận diện biểu thức vi phân du trong phương pháp đổi biến số.',
        keyConcepts: [
          'Bảng đạo hàm các hàm số sơ cấp cơ bản',
          'Đạo hàm của tích (uv)\' và thương (u/v)\'',
          'Quy tắc đạo hàm hàm hợp y\' = f\'(u) · u\'',
          'Khái niệm vi phân df = f\'(x)dx',
        ],
        recommendedFormulaIds: [
          {id: 'f40', title: 'Định nghĩa & Quy tắc đạo hàm'},
          {id: 'f41', title: 'Đạo hàm tích, thương, hàm hợp'},
        ],
      },
      {
        level: 6,
        grade: 'Mục tiêu đích đến · Lớp 12 & Đại học',
        name: 'Nguyên hàm & Tích phân xác định',
        formulaLatex: '\\int_a^b f(x)\\,dx = F(b) - F(a),\\quad \\int u\\,dv = uv - \\int v\\,du',
        whyNeeded:
          'Khi đã có trọn vẹn 5 nền tảng trên, bạn sẽ học tích phân một cách dễ dàng, tự tin áp dụng công thức Newton-Leibniz, đổi biến số và tích phân từng phần.',
        keyConcepts: [
          'Bảng nguyên hàm cơ bản & mở rộng',
          'Công thức Newton - Leibniz',
          'Phương pháp đổi biến số loại 1 và loại 2',
          'Phương pháp tích phân từng phần (nhất lô, nhì đa, tam lượng, tứ mũ)',
        ],
        recommendedFormulaIds: [
          {id: 'f42', title: 'Nguyên hàm cơ bản'},
          {id: 'f43', title: 'Tích phân xác định & Newton-Leibniz'},
        ],
      },
    ],
  },
  {
    id: 'linear-algebra-matrices',
    icon: Boxes,
    title: 'Ma trận & Đại số tuyến tính',
    badge: 'ỨNG DỤNG AI & ĐỒ HỌA',
    goal: 'Giải hệ phương trình nhiều ẩn, biến đổi tọa độ 3D, mô hình hóa dữ liệu và học máy (Machine Learning/AI).',
    coreQuestion: 'Muốn học Ma trận thì nên vững nền tảng nào trước?',
    flowchain: [
      '1. Hệ phương trình bậc nhất',
      '2. Tọa độ & Vector',
      '3. Phép toán Ma trận',
      '4. Định thức (Det)',
      '🎯 ĐÍCH ĐẾN: ĐẠI SỐ TUYẾN TÍNH',
    ],
    whySequenceMatters:
      'Ma trận thực chất là một cách viết nén gọn gàng toàn bộ một hệ phương trình tuyến tính nhiều ẩn và là công cụ mô tả các phép biến đổi vector trong không gian. Muốn hiểu ma trận nhân với nhau như thế nào, ta phải hiểu tích vô hướng của vector hàng với vector cột.',
    stuckTrapIfSkipped:
      'Nếu chưa vững hệ phương trình và vector, bạn sẽ coi ma trận chỉ là một bảng số cơ học, học vẹt quy tắc nhân hàng-cột mà không hiểu ý nghĩa, không hiểu tại sao det(A) = 0 thì hệ vô nghiệm hoặc ma trận không khả nghịch.',
    steps: [
      {
        level: 1,
        grade: 'Nền tảng 1 · THCS',
        name: 'Hệ phương trình tuyến tính 2 & 3 ẩn',
        formulaLatex: 'a_1 x + b_1 y = c_1,\\quad a_2 x + b_2 y = c_2',
        whyNeeded: 'Hiểu bản chất nghiệm của hệ phương trình trước khi đưa về dạng phương trình ma trận AX = B.',
        keyConcepts: ['Phương pháp thế và cộng đại số', 'Khử ẩn Gauss căn bản', 'Điều kiện nghiệm duy nhất / vô nghiệm'],
        recommendedFormulaIds: [{id: 'f11', title: 'Hệ phương trình bậc nhất'}],
      },
      {
        level: 2,
        grade: 'Nền tảng 2 · Lớp 10 - 12',
        name: 'Hình học Vector & Tích vô hướng',
        formulaLatex: '\\mathbf{u} \\cdot \\mathbf{v} = u_1 v_1 + u_2 v_2 + u_3 v_3',
        whyNeeded: 'Mỗi hàng và mỗi cột của ma trận là một vector. Phép nhân ma trận chính là tích vô hướng giữa các vector.',
        keyConcepts: ['Tọa độ vector trong ℝ² và ℝ³', 'Tích vô hướng và góc', 'Độ dài vector'],
        recommendedFormulaIds: [
          {id: 'geo-dot', title: 'Tích vô hướng vector'},
          {id: 'geo-coordinates', title: 'Tọa độ điểm & vector'},
        ],
      },
      {
        level: 3,
        grade: 'Nền tảng 3 · Đại học cơ bản',
        name: 'Định nghĩa & Các phép toán Ma trận',
        formulaLatex: 'C_{ij} = \\sum_{k=1}^n A_{ik} B_{kj}',
        whyNeeded: 'Nắm vững các phép toán cộng, trừ, nhân ma trận và ma trận chuyển vị Aᵀ.',
        keyConcepts: ['Cấp ma trận m × n', 'Phép nhân ma trận (hàng nhân cột)', 'Ma trận đơn vị và chuyển vị'],
        recommendedFormulaIds: [
          {id: 'mat-definition', title: 'Định nghĩa ma trận'},
          {id: 'mat-multiplication', title: 'Phép nhân ma trận'},
        ],
      },
      {
        level: 4,
        grade: 'Mục tiêu đích đến · Đại học',
        name: 'Định thức, Ma trận nghịch đảo & Trị riêng',
        formulaLatex: '\\det(A) \\neq 0 \\implies A^{-1} = \\frac{1}{\\det(A)}\\operatorname{adj}(A),\\quad A\\mathbf{v} = \\lambda \\mathbf{v}',
        whyNeeded: 'Giải hệ phương trình bằng quy tắc Cramer, tìm ma trận nghịch đảo và phân tích không gian vector.',
        keyConcepts: ['Định thức cấp 2, 3 và cấp n', 'Ma trận nghịch đảo A⁻¹', 'Hạng của ma trận & thuật toán khử Gauss', 'Trị riêng & vector riêng'],
        recommendedFormulaIds: [
          {id: 'mat-determinant', title: 'Định thức ma trận'},
          {id: 'mat-inverse', title: 'Ma trận nghịch đảo'},
          {id: 'mat-cramer-system', title: 'Hệ Cramer'},
        ],
      },
    ],
  },
  {
    id: 'probability-statistics',
    icon: PieChart,
    title: 'Xác suất & Thống kê',
    badge: 'KHOA HỌC DỮ LIỆU',
    goal: 'Phân tích dữ liệu thực tế, đo lường rủi ro tài chính, dự báo thời tiết và đánh giá mô hình trí tuệ nhân tạo.',
    coreQuestion: 'Muốn học Xác suất thì nên vững nền tảng nào trước?',
    flowchain: [
      '1. Phân số & Tỉ lệ',
      '2. Tập hợp & Phép toán',
      '3. Đại số tổ hợp (A, C, P)',
      '4. Xác suất cơ bản',
      '🎯 ĐÍCH ĐẾN: PHÂN PHỐI XÁC SUẤT',
    ],
    whySequenceMatters:
      'Xác suất là tỉ số giữa số biến cố thuận lợi trên tổng số phần tử không gian mẫu P(A) = n(A)/n(Ω). Muốn đếm được n(A) và n(Ω) trong các bài toán phức tạp, bạn bắt buộc phải thành thạo quy tắc nhân, chỉnh hợp và tổ hợp.',
    stuckTrapIfSkipped:
      'Nếu không vững quy tắc đếm và tổ hợp, bạn sẽ luôn đếm trùng hoặc đếm thiếu trường hợp, lúng túng khi phân biệt hoán vị, chỉnh hợp và tổ hợp, dẫn đến tính sai không gian mẫu.',
    steps: [
      {
        level: 1,
        grade: 'Nền tảng 1 · THCS',
        name: 'Tỉ lệ phần trăm & Phân số',
        formulaLatex: 'P = \\frac{m}{n} \\in [0, 1]',
        whyNeeded: 'Hiểu bản chất xác suất luôn là một số thực nằm trong khoảng từ 0 đến 1 (tương đương 0% đến 100%).',
        keyConcepts: ['Tỉ số & phân số', 'Quy đồng và cộng trừ phân số', 'Tỉ lệ phần trăm'],
        recommendedFormulaIds: [{id: 'f6', title: 'Phân số & phân thức'}],
      },
      {
        level: 2,
        grade: 'Nền tảng 2 · Lớp 10',
        name: 'Lý thuyết Tập hợp & Không gian mẫu',
        formulaLatex: 'A \\cup B,\\quad A \\cap B,\\quad \\overline{A} = \\Omega \\setminus A',
        whyNeeded: 'Biến cố trong xác suất chính là các tập con của không gian mẫu Ω.',
        keyConcepts: ['Phần tử và tập hợp', 'Giao, hợp và phần bù của tập hợp', 'Sơ đồ Venn'],
        recommendedFormulaIds: [{id: 'prob-counting', title: 'Quy tắc đếm cơ bản'}],
      },
      {
        level: 3,
        grade: 'Nền tảng 3 · Lớp 10 - 11',
        name: 'Đại số tổ hợp (Hoán vị, Chỉnh hợp, Tổ hợp)',
        formulaLatex: 'P_n = n!,\\quad A_n^k = \\frac{n!}{(n-k)!},\\quad C_n^k = \\frac{n!}{k!(n-k)!}',
        whyNeeded: 'Công cụ quyết định để đếm nhanh số khả năng xảy ra mà không cần liệt kê thủ công.',
        keyConcepts: ['Quy tắc cộng và quy tắc nhân', 'Giai thừa n!', 'Phân biệt chỉnh hợp (có thứ tự) và tổ hợp (không thứ tự)'],
        recommendedFormulaIds: [{id: 'prob-counting', title: 'Đại số tổ hợp'}],
      },
      {
        level: 4,
        grade: 'Mục tiêu đích đến · Lớp 11 - 12 & Đại học',
        name: 'Xác suất, Công thức Bayes & Phân phối chuẩn',
        formulaLatex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)},\\quad f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
        whyNeeded: 'Xác định xác suất có điều kiện, suy luận Bayes và phân tích dữ liệu thống kê lớn.',
        keyConcepts: ['Biến cố độc lập', 'Xác suất có điều kiện & định lý Bayes', 'Biến ngẫu nhiên, kỳ vọng E(X) và phương sai Var(X)', 'Phân phối chuẩn hình chuông Gauss'],
        recommendedFormulaIds: [
          {id: 'prob-rules', title: 'Quy tắc tính xác suất'},
          {id: 'prob-bayes', title: 'Công thức Bayes'},
          {id: 'prob-normal', title: 'Phân phối chuẩn'},
        ],
      },
    ],
  },
  {
    id: 'solid-geometry',
    icon: Box,
    title: 'Hình học không gian & Oxyz',
    badge: 'HÌNH HỌC 3D',
    goal: 'Giải quyết các bài toán kiến trúc, xây dựng, định vị GPS, mô phỏng đồ họa không gian 3 chiều.',
    coreQuestion: 'Muốn học Hình học không gian thì nên vững nền tảng nào trước?',
    flowchain: [
      '1. Hình học phẳng THCS',
      '2. Quan hệ song song 3D',
      '3. Quan hệ vuông góc 3D',
      '4. Thể tích khối đa diện',
      '🎯 ĐÍCH ĐẾN: TỌA ĐỘ OXYZ',
    ],
    whySequenceMatters:
      'Mọi khối không gian (lăng trụ, chóp, hình trụ, nón) đều được giới hạn bởi các mặt phẳng hoặc đường tròn. Mọi bài toán tính khoảng cách hay thể tích trong không gian 3D cuối cùng đều được quy về tam giác vuông hoặc tam giác thường trên một mặt phẳng phẳng.',
    stuckTrapIfSkipped:
      'Nếu không vững định lý Pythagoras, hệ thức lượng và diện tích phẳng, bạn sẽ không thể tính được diện tích đáy, không tìm được chiều cao hạ từ đỉnh chóp, và không giải được góc giữa đường thẳng với mặt phẳng.',
    steps: [
      {
        level: 1,
        grade: 'Nền tảng 1 · THCS',
        name: 'Hình học phẳng (Pythagoras & Diện tích)',
        formulaLatex: 'a^2 + b^2 = c^2,\\quad S = \\frac{ah}{2},\\quad S = \\pi r^2',
        whyNeeded: 'Mặt đáy của hình không gian là tam giác, tứ giác hoặc hình tròn. Phải tính được diện tích đáy mới tính được thể tích.',
        keyConcepts: ['Định lý Pythagoras', 'Diện tích tam giác, hình thang, hình tròn', 'Tỉ số lượng giác sin, cos, tan'],
        recommendedFormulaIds: [
          {id: 'geo-pythagoras', title: 'Định lý Pythagoras'},
          {id: 'geo-triangle-area', title: 'Diện tích tam giác'},
          {id: 'geo-right-triangle-relations', title: 'Hệ thức lượng tam giác vuông'},
        ],
      },
      {
        level: 2,
        grade: 'Nền tảng 2 · Lớp 11',
        name: 'Quan hệ Vuông góc & Song song trong không gian',
        formulaLatex: 'd \\perp (P) \\iff d \\perp a,\\ d \\perp b\\quad (a, b \\subset (P),\\ a \\cap b)',
        whyNeeded: 'Đường cao của hình chóp hay hình lăng trụ là đường thẳng vuông góc với mặt phẳng đáy.',
        keyConcepts: ['Đường thẳng vuông góc mặt phẳng', 'Hai mặt phẳng vuông góc', 'Góc giữa đường thẳng và mặt phẳng', 'Khoảng cách giữa hai đường thẳng chéo nhau'],
        recommendedFormulaIds: [{id: 'geo-pyramid', title: 'Thể tích chóp & lăng trụ'}],
      },
      {
        level: 3,
        grade: 'Mục tiêu đích đến · Lớp 12',
        name: 'Phương pháp Tọa độ Oxyz',
        formulaLatex: 'ax + by + cz + d = 0,\\quad d(M, P) = \\frac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^2 + b^2 + c^2}}',
        whyNeeded: 'Chuyển toàn bộ hình học không gian 3D phức tạp thành đại số vector tính toán số học chính xác.',
        keyConcepts: ['Tọa độ điểm và vector trong Oxyz', 'Tích có hướng của hai vector', 'Phương trình mặt phẳng, đường thẳng và mặt cầu'],
        recommendedFormulaIds: [
          {id: 'geo-space-plane', title: 'Mặt phẳng không gian Oxyz'},
          {id: 'geo-cross', title: 'Tích có hướng vector'},
        ],
      },
    ],
  },
  {
    id: 'complex-numbers',
    icon: Binary,
    title: 'Số phức & Công thức Euler',
    badge: 'TOÁN HỌC HIỆN ĐẠI',
    goal: 'Mở rộng trường số thực ℝ lên trường số phức ℂ, giải phương trình đại số, ứng dụng trong điện xoay chiều và xử lý tín hiệu số.',
    coreQuestion: 'Muốn học Số phức thì nên vững nền tảng nào trước?',
    flowchain: [
      '1. Phương trình bậc hai',
      '2. Mặt phẳng tọa độ Oxy',
      '3. Đường tròn lượng giác',
      '🎯 ĐÍCH ĐẾN: SỐ PHỨC & EULER',
    ],
    whySequenceMatters:
      'Số phức ra đời để giải quyết các phương trình bậc hai có biệt thức Δ < 0 (nơi số thực bế tắc). Số phức có 2 bản chất song hành: đại số (z = a + bi) và hình học/lượng giác (z = r(cos θ + i sin θ)). Do đó phải hiểu tọa độ Oxy và lượng giác thì mới hiểu bản chất phép quay của số phức.',
    stuckTrapIfSkipped:
      'Nếu không vững lượng giác, bạn sẽ chỉ làm được các bài cộng trừ số phức đơn giản, hoàn toàn không hiểu dạng lượng giác, không áp dụng được công thức De Moivre để khai căn số phức hay công thức Euler e^(iθ).',
    steps: [
      {
        level: 1,
        grade: 'Nền tảng 1 · Lớp 9',
        name: 'Phương trình bậc hai & Biệt thức Δ < 0',
        formulaLatex: 'x^2 + 1 = 0 \\implies x = \\pm i\\quad (i^2 = -1)',
        whyNeeded: 'Số phức bắt đầu từ đơn vị ảo i với quy ước i² = −1 để mọi phương trình bậc n đều có nghiệm.',
        keyConcepts: ['Phương trình bậc hai', 'Công thức nghiệm Δ', 'Quy tắc cộng trừ nhân chia đại số'],
        recommendedFormulaIds: [{id: 'f10', title: 'Phương trình bậc hai'}],
      },
      {
        level: 2,
        grade: 'Nền tảng 2 · Lớp 10 - 11',
        name: 'Tọa độ Oxy & Đường tròn lượng giác',
        formulaLatex: 'z = a + bi \\longleftrightarrow M(a, b),\\quad r = \\sqrt{a^2 + b^2}',
        whyNeeded: 'Mỗi số phức tương ứng với một điểm M trên mặt phẳng phức Gauss; mô đun là độ dài đoạn thẳng OM.',
        keyConcepts: ['Hệ tọa độ Oxy', 'Tọa độ cực (r, θ)', 'Định lý Pythagoras tính khoảng cách'],
        recommendedFormulaIds: [
          {id: 'geo-coordinates', title: 'Khoảng cách tọa độ'},
          {id: 'f35', title: 'Mô đun & số phức liên hợp'},
        ],
      },
      {
        level: 3,
        grade: 'Mục tiêu đích đến · Lớp 12 & Đại học',
        name: 'Dạng lượng giác & Công thức Euler',
        formulaLatex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta,\\quad [r(\\cos\\theta + i\\sin\\theta)]^n = r^n(\\cos n\\theta + i\\sin n\\theta)',
        whyNeeded: 'Công thức Euler kết nối 5 hằng số toán học vĩ đại: e, i, π, 1, 0 qua đồng nhất thức e^(iπ) + 1 = 0.',
        keyConcepts: ['Argument chính của số phức', 'Công thức De Moivre', 'Công thức Euler và ứng dụng dao động điều hòa'],
        recommendedFormulaIds: [
          {id: 'f36', title: 'Dạng lượng giác của số phức'},
          {id: 'f37', title: 'Công thức De Moivre'},
          {id: 'f38', title: 'Công thức Euler'},
        ],
      },
    ],
  },
  {
    id: 'inequalities',
    icon: Scale,
    title: 'Bất đẳng thức & Cực trị',
    badge: 'TƯ DUY ĐỈNH CAO',
    goal: 'Tìm giá trị lớn nhất (GTLN), giá trị nhỏ nhất (GTNN), tối ưu hóa tài nguyên và rèn luyện tư duy toán học đỉnh cao.',
    coreQuestion: 'Muốn học Bất đẳng thức nâng cao thì nên vững nền tảng nào trước?',
    flowchain: [
      '1. Hằng đẳng thức bình phương',
      '2. Giá trị tuyệt đối & Căn',
      '3. Bất đẳng thức AM-GM',
      '🎯 ĐÍCH ĐẾN: CAUCHY-SCHWARZ & JENSEN',
    ],
    whySequenceMatters:
      'Mọi bất đẳng thức vĩ đại đều bắt nguồn từ một chân lý hiển nhiên: (a − b)² ≥ 0 với mọi số thực. Khi khai triển hằng đẳng thức này, ta được a² + b² ≥ 2ab, từ đó mở rộng thành bất đẳng thức AM-GM, Cauchy-Schwarz và Jensen.',
    stuckTrapIfSkipped:
      'Nếu không nắm chắc kĩ thuật tìm "điểm rơi" (điều kiện dấu bằng xảy ra) từ bất đẳng thức AM-GM 2 số, bạn sẽ áp dụng bất đẳng thức một cách máy móc và sai kết quả cực trị.',
    steps: [
      {
        level: 1,
        grade: 'Nền tảng 1 · THCS',
        name: 'Hằng đẳng thức bình phương không âm',
        formulaLatex: '(a - b)^2 \\ge 0 \\iff a^2 + b^2 \\ge 2ab',
        whyNeeded: 'Là hạt nhân nguồn gốc của hầu hết mọi phép chứng minh bất đẳng thức.',
        keyConcepts: ['Bình phương một tổng và hiệu', 'Khai triển hằng đẳng thức', 'Thêm bớt hạng tử'],
        recommendedFormulaIds: [{id: 'f1', title: 'Hằng đẳng thức bậc hai'}],
      },
      {
        level: 2,
        grade: 'Nền tảng 2 · Lớp 10',
        name: 'Bất đẳng thức AM-GM (Cauchy)',
        formulaLatex: '\\frac{a_1 + \\dots + a_n}{n} \\ge \\sqrt[n]{a_1 \\cdots a_n}',
        whyNeeded: 'Chuyển hóa giữa bài toán tổng và tích để tìm cực trị khi các số dương.',
        keyConcepts: ['Điều kiện số không âm', 'Kỹ thuật chọn điểm rơi', 'Kỹ thuật nghịch đảo và thêm bớt'],
        recommendedFormulaIds: [{id: 'f19', title: 'Bất đẳng thức AM-GM'}],
      },
      {
        level: 3,
        grade: 'Mục tiêu đích đến · Lớp 10 - 12 & Olympic',
        name: 'Cauchy-Schwarz, Hölder & Jensen',
        formulaLatex: '\\left(\\sum a_i b_i\\right)^2 \\le \\left(\\sum a_i^2\\right)\\left(\\sum b_i^2\\right),\\quad f\\left(\\sum w_i x_i\\right) \\le \\sum w_i f(x_i)',
        whyNeeded: 'Giải quyết các bài toán phân thức đối xứng bậc cao và bất đẳng thức hàm lồi.',
        keyConcepts: ['Dạng phân thức Engel (Schwarz)', 'Số mũ liên hợp Hölder', 'Hàm lồi và bất đẳng thức Jensen'],
        recommendedFormulaIds: [
          {id: 'f20', title: 'Bất đẳng thức Cauchy-Schwarz'},
          {id: 'f21', title: 'Bất đẳng thức Jensen'},
          {id: 'f27', title: 'Bất đẳng thức Nesbitt'},
        ],
      },
    ],
  },
];

export function MindmapView({
  openLesson,
  openTopic,
  navigate,
}: {
  openLesson: (id: string) => void;
  openTopic: (topicId: string) => void;
  navigate: (view: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'prereq' | 'mindmap'>('prereq');
  const [selectedTrackId, setSelectedTrackId] = useState('calculus-integrals');

  const currentTrack =
    PREREQUISITE_TRACKS.find((t) => t.id === selectedTrackId) || PREREQUISITE_TRACKS[0];

  return (
    <div style={{maxWidth: 1100, margin: '0 auto'}}>
      <div className="page-heading">
        <p className="eyebrow">CHƯƠNG TRÌNH KHUNG · CÂY TIỀN ĐỀ TOÁN HỌC</p>
        <h1>Chương trình khung & Tiền đề kiến thức</h1>
        <p>
          Biết chính xác bắt đầu học từ đâu: Muốn học tốt một chủ đề nâng cao (ví dụ: Tích phân, Ma trận, Xác suất, Hình không gian...) thì cần vững những nền tảng nào trước, tránh tình trạng học vẹt hoặc bị hổng mắt xích căn bản.
        </p>
      </div>

      {/* TOP TABS */}
      <div className="control-row filter-row" style={{marginBottom: 24}}>
        <div className="geometry-subchips">
          <button
            className={`geometry-subchip ${activeTab === 'prereq' ? 'active' : ''}`}
            onClick={() => setActiveTab('prereq')}
            style={{display: 'inline-flex', alignItems: 'center', gap: 7}}
          >
            <Compass size={16} /> 📋 Cây tiền đề môn học (Học cái gì trước?)
          </button>
          <button
            className={`geometry-subchip ${activeTab === 'mindmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('mindmap')}
            style={{display: 'inline-flex', alignItems: 'center', gap: 7}}
          >
            <Network size={16} /> 🌳 Bản đồ tư duy tổng thể (Full Mindmap)
          </button>
        </div>
      </div>

      {activeTab === 'prereq' ? (
        <div>
          {/* TRACK SELECTOR CHIPS */}
          <div className="prereq-track-selector">
            {PREREQUISITE_TRACKS.map((track) => {
              const Icon = track.icon;
              const isSelected = track.id === selectedTrackId;
              return (
                <button
                  key={track.id}
                  className={`prereq-track-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedTrackId(track.id)}
                >
                  <Icon size={18} />
                  <span>{track.title}</span>
                  {track.badge && (
                    <span
                      style={{
                        fontSize: 10.5,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--accent)',
                        color: isSelected ? 'white' : 'var(--primary)',
                        fontWeight: 700,
                      }}
                    >
                      {track.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* HERO BANNER FOR SELECTED TRACK */}
          <div className="prereq-hero">
            <span className="tag blue">{currentTrack.badge || 'CHƯƠNG TRÌNH KHUNG'}</span>
            <h2>{currentTrack.coreQuestion}</h2>
            <p style={{marginBottom: 12}}>
              <strong>Mục tiêu:</strong> {currentTrack.goal}
            </p>
          </div>

          {/* PREREQUISITES FLOWCHART BANNER */}
          <div className="prereq-flowchart-banner">
            <div className="prereq-flowchart-title">
              <Sparkles size={16} /> Sơ đồ cây tiền đề kiến thức tuần tự (Từ gốc đến ngọn)
            </div>
            <div className="prereq-chain-flow">
              {currentTrack.flowchain.map((node, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div
                    className={`prereq-chain-node ${
                      idx === currentTrack.flowchain.length - 1 ? 'target-node' : ''
                    }`}
                  >
                    {node}
                  </div>
                  {idx < currentTrack.flowchain.length - 1 && (
                    <span className="prereq-chain-arrow">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* INSIGHT BOXES: WHY SEQUENCE MATTERS & TRAPS IF SKIPPED */}
          <div className="prereq-insight-grid">
            <div className="prereq-insight-box prereq-insight-why">
              <div className="prereq-insight-title">
                <HelpCircle size={17} /> Tại sao bắt buộc phải học theo thứ tự này?
              </div>
              <p style={{margin: 0}}>{currentTrack.whySequenceMatters}</p>
            </div>

            <div className="prereq-insight-box prereq-insight-trap">
              <div className="prereq-insight-title">
                <AlertTriangle size={17} /> Nếu nhảy cóc mà thiếu nền tảng thì bị nghẽn ở đâu?
              </div>
              <p style={{margin: 0}}>{currentTrack.stuckTrapIfSkipped}</p>
            </div>
          </div>

          {/* STEP-BY-STEP FOUNDATION BREAKDOWN */}
          <h3 style={{fontSize: 20, margin: '28px 0 16px', color: 'var(--foreground)'}}>
            Chi tiết các bậc thang nền tảng cần làm chủ:
          </h3>

          <div className="prereq-steps-list">
            {currentTrack.steps.map((step) => (
              <div key={step.level} className="prereq-step-card">
                <div className="prereq-step-header">
                  <div>
                    <span className="prereq-step-num">{step.grade}</span>
                    <h4 className="prereq-step-title">{step.name}</h4>
                  </div>
                </div>

                <div className="prereq-step-formula">
                  <MathFormula latex={step.formulaLatex} />
                </div>

                <p className="prereq-step-desc">
                  <strong>Vì sao cần nền tảng này:</strong> {step.whyNeeded}
                </p>

                <div className="prereq-step-concepts">
                  {step.keyConcepts.map((c, i) => (
                    <span key={i} className="prereq-concept-pill">
                      ✓ {c}
                    </span>
                  ))}
                </div>

                <div className="prereq-step-actions">
                  <span className="muted small" style={{marginRight: 6}}>
                    <BookOpen size={14} style={{display: 'inline', verticalAlign: '-2px', marginRight: 4}} />
                    Bài học liên kết trong Sổ tay:
                  </span>
                  {step.recommendedFormulaIds.map((rec) => (
                    <button
                      key={rec.id}
                      className="phase-lesson-chip"
                      onClick={() => {
                        if (rec.id.startsWith('geo-')) {
                          navigate('geometry');
                        } else {
                          openLesson(rec.id);
                        }
                      }}
                    >
                      <span>{rec.title}</span>
                      <ArrowRight size={13} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TAB 2: FULL MINDMAP VIEW */
        <div>
          <div className="panel" style={{marginBottom: 24, padding: 22}}>
            <h3>Bản đồ tư duy toàn bộ hệ thống Toán học</h3>
            <p className="muted" style={{margin: '8px 0 0'}}>
              Bấm vào từng chuyên đề hoặc tên bài học để chuyển ngay tới phần học lý thuyết, xem chứng minh và làm bài tập trắc nghiệm.
            </p>
          </div>

          <div className="mindmap">
            <div className="mindmap-root">
              MATH
              <br />
              HANDBOOK PRO
            </div>
            <div className="mindmap-branches">
              {topics.map((t) => {
                const topicFormulas = formulas.filter((f) => f.topic === t.id);
                return (
                  <section className="mindmap-branch" key={t.id}>
                    <button className="branch-title" onClick={() => openTopic(t.id)}>
                      <span>{t.name}</span>
                      <span className="tag small" style={{marginLeft: 8}}>
                        {topicFormulas.length} bài
                      </span>
                      <ArrowRight size={16} />
                    </button>
                    <div>
                      {topicFormulas.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            if (f.id.startsWith('geo-')) {
                              navigate('geometry');
                            } else {
                              openLesson(f.id);
                            }
                          }}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
