"use client";

import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      console.log("送信できました！", result);
      alert("送信しました！");
      reset();
    } catch (err) {
      console.log("送信エラー", err);
      alert("送信エラー");
    }
  };

  const handleReset = () => reset();

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="name" className="w-[240px]">
            お名前
          </label>
          <div className="w-full">
            <input
              id="name"
              type="text"
              className="border border-gray-300 rounded-lg p-4 w-full"
              {...register("name", {
                required: "お名前は必須です。",
                maxLength: {
                  value: 30,
                  message: "名前は30文字以内にしてください。",
                },
              })}
            />
            <p className="text-sm text-red-700 font-bold">
              {errors.name?.message}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <label htmlFor="email" className="w-[240px]">
            メールアドレス
          </label>
          <div className="w-full">
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded-lg p-4 w-full"
              {...register("email", {
                required: "メールアドレスは必須です。",
                pattern: {
                  value:
                    /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
                  message: "正しいメールアドレスを入力してください。",
                },
              })}
            />
            <p className="text-sm text-red-700 font-bold">
              {errors.email?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <label htmlFor="message" className="w-[240px]">
            本文
          </label>
          <div className="w-full">
            <textarea
              id="message"
              rows={8}
              className="w-full border border-gray-300 rounded-lg p-10"
              {...register("message", {
                required: "本文は必須です。",
                maxLength: {
                  value: 500,
                  message: "本文は500文字以内にしてください。",
                },
              })}
            />
            <p className="text-sm text-red-700 font-bold">
              {errors.message?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
          >
            {isSubmitting ? "送信中..." : "送信"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-200 font-bold py-2 px-4 rounded-lg"
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
