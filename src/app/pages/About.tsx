export default function About() {
  return (
    <section
      dir="rtl"
      className="min-h-screen bg-[#16B8BE] px-6 pt-32 text-white"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold">تتبع طلبك</h1>

        <p className="mt-5 text-xl">
          أدخل رقم الهاتف المستخدم في الطلب لمعرفة حالة طلبك
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-[#075E66] p-8">
          <input
            type="tel"
            placeholder="+968 9435 5353"
            className="w-full rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/50"
          />

          <button
            type="button"
            className="mt-4 w-full rounded-2xl bg-white px-6 py-4 font-bold text-black"
          >
            تتبع الطلب
          </button>
        </div>
      </div>
    </section>
  );
}
