export default function InfoPage() {
  return (
    <div className="px-4 pt-8 pb-6 max-w-sm md:max-w-2xl mx-auto">
      <h1 className="text-white font-bold text-[22px] mb-1">МЭДЭЭЛЭЛ</h1>
      <p className="text-neutral-400 text-[11px] mb-6">Chronicle-ийн тухай</p>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        <div className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <h2 className="text-white text-[14px] font-semibold mb-2">
            Бидний тухай
          </h2>
          <p className="text-neutral-400 text-[12px] leading-relaxed">
            Chronicle — Улаанбаатар хотод үйл ажиллагаа явуулдаг хувцасны
            онлайн дэлгүүр. Бид чанартай, орчин үеийн хувцас, шуурхай
            хүргэлтийг санал болгодог.
          </p>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <h2 className="text-white text-[14px] font-semibold mb-3">
            Хүргэлт
          </h2>
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 text-[12px]">Улаанбаатар хот</span>
            <span className="text-white text-[12px]">1-2 өдөр</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 text-[12px]">Орон нутаг</span>
            <span className="text-white text-[12px]">3-5 өдөр</span>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <h2 className="text-white text-[14px] font-semibold mb-3">
            Төлбөрийн хэлбэр
          </h2>
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 text-[12px]">QPay</span>
            <span className="text-white text-[12px]">Тийм</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 text-[12px]">Дансаар шилжүүлэх</span>
            <span className="text-white text-[12px]">Тийм</span>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-4">
          <h2 className="text-white text-[14px] font-semibold mb-3">
            Холбоо барих
          </h2>
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 text-[12px]">Утас</span>
            <span className="text-white text-[12px]">9911-XXXX</span>
          </div>
          <div className="flex justify-between py-1.5 items-center">
            <span className="text-neutral-400 text-[12px]">Instagram</span>
            <a href="https://instagram.com/chronicle.mn" target="_blank" className="text-white text-[12px] underline">@chronicle.mn</a>
          </div>
        </div>
      </div>
    </div>
  )
}