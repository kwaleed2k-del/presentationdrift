import { FinaleSlide, ProcessSlide, StatementSlide, StatsSlide, TitleSlide } from '@/archetypes'
import { defineDeck } from '@/engine/types'

// Arabic, right-to-left. Archetypes detect Arabic text and skip per-letter effects (they break letter joining).
export default defineDeck({
  title: 'منصة ريادة · عرض تجريبي',
  theme: 'sunset-heat',
  rtl: true,
  slides: [
    { id: 'title', section: 'البداية', render: () => <TitleSlide title="منصة ريادة" subtitle="تسويق ذكي لكل مشروع سعودي" chips={['ذكاء اصطناعي', 'عربي أولاً', 'نتائج خلال دقائق']} bg="threads" size={170} /> },
    {
      id: 'problem',
      section: 'المشكلة',
      render: () => (
        <StatementSlide
          kicker="المشكلة"
          line1="التسويق مكلف وبطيء"
          line2="والمشاريع الصغيرة تستحق أفضل"
          cards={[
            { icon: '💸', text: 'الوكالات أسعارها فوق طاقة المشاريع الناشئة.' },
            { icon: '⏳', text: 'الحملات تأخذ أسابيع قبل أن تبدأ.' },
            { icon: '🌐', text: 'أغلب الأدوات لا تفهم اللغة العربية.' },
          ]}
          bg="none"
        />
      ),
    },
    {
      id: 'how',
      section: 'الحل',
      render: () => (
        <ProcessSlide
          kicker="كيف تعمل"
          title="أربع خطوات"
          accent="من الفكرة إلى الحملة"
          steps={[
            { icon: '✍️', title: 'اكتب فكرتك', sub: 'بالعربي' },
            { icon: '🧠', title: 'تحليل ذكي', sub: 'لعلامتك' },
            { icon: '🎨', title: 'تصاميم جاهزة', sub: 'بهويتك' },
            { icon: '🚀', title: 'انشر', sub: 'بضغطة' },
          ]}
        />
      ),
    },
    { id: 'numbers', section: 'الأرقام', render: () => <StatsSlide kicker="أرقام تجريبية" title="نتائج" accent="سريعة" stats={[{ value: 60, suffix: 'ث', label: 'لأول تصميم' }, { value: 14, label: 'خط عربي' }, { value: 95, suffix: '٪', label: 'رضا المستخدمين', ring: 95 }]} /> },
    { id: 'finale', section: 'الختام', render: () => <FinaleSlide kicker="شكراً" line1="فكرتك تستاهل" line2="جرّب ريادة اليوم" signoff="عرض تجريبي · بيانات توضيحية" /> },
  ],
})
