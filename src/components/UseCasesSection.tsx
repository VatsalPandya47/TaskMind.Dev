
const useCases = [
  {
    title: "Founders",
    example: "Track everything that's promised in investor updates or all-hands, then follow up by tagging owners in Slack without manual notes."
  },
  {
    title: "Engineering Managers",
    example: "Never forget decisions made in sprint planning—action items are extracted in real-time, synced to project management tools, and delivered in your daily summary."
  },
  {
    title: "Product Managers",
    example: "Tie meetings to outcomes: TaskMind lets you assign, reassign, and monitor action items live, eliminating 'let me follow up later' from your team."
  },
  {
    title: "Sales Leaders",
    example: "Automate handoffs from discovery calls—every client commitment and follow-up is tracked and assigned."
  }
];

const UseCasesSection = () => (
  <section className="w-full bg-white py-16 md:py-24 border-b">
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-gray-900">Who is TaskMind For?</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {useCases.map(uc => (
          <div key={uc.title} className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">{uc.title}</h3>
            <p className="text-base text-gray-600"><em>{uc.example}</em></p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
