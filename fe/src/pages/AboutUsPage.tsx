function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl p-8 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-md">
        <h1 className="text-4xl font-extrabold text-primary mb-6 text-center">
          About Us
        </h1>
        <p className="text-lg text-neutral-700 font-bold mb-4">
          Welcome to Quiz App! We are passionate about creating engaging and
          challenging quizzes to test your knowledge and help you learn while
          having fun.
        </p>
        <p className="text-lg text-neutral-700 font-bold mb-4">
          Our platform allows you to create, share, and attempt quizzes on a
          wide range of topics. Whether you’re a student, teacher, or just a
          curious mind, Quiz App is built for you.
        </p>
      </div>
    </div>
  );
}

export default AboutUsPage;
