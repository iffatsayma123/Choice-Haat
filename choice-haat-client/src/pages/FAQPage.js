export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <ul className="space-y-4">
        <li>
          <b>How do I order?</b><br/>
          Simply add items to your cart, checkout, and we'll deliver to your doorstep.
        </li>
        <li>
          <b>Is cash on delivery available?</b><br/>
          Yes! You can pay when your product arrives.
        </li>
        {/* Add more Q&A as needed */}
      </ul>
    </div>
  );
}
