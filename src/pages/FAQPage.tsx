
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I create an account on Jikagri?",
      answer: "Click on the 'Sign In' button in the top right corner and then select 'Sign Up'. Fill in your details including email, password, and basic information. You'll receive a confirmation email to verify your account."
    },
    {
      question: "How can I start selling my agricultural products?",
      answer: "After creating an account, go to 'My Store' in your profile menu. Set up your store with details like name, location, and description. Then you can start adding products with photos, descriptions, and prices."
    },
    {
      question: "What types of products can I sell on Jikagri?",
      answer: "You can sell various agricultural products including crops, livestock, dairy products, poultry, aquaculture, horticulture, cereals, legumes, fruits, vegetables, farm equipment, seeds, fertilizers, and pesticides."
    },
    {
      question: "How do I contact a seller?",
      answer: "On any product page, click the 'Contact Seller' button. This will open a chat where you can directly message the seller to ask questions, negotiate prices, or arrange delivery."
    },
    {
      question: "Is Jikagri available in all counties of Kenya?",
      answer: "Yes! Jikagri serves all 47 counties in Kenya. You can filter products and stores by county to find local suppliers or expand your market reach."
    },
    {
      question: "How does payment work on Jikagri?",
      answer: "Currently, payments are arranged directly between buyers and sellers through the messaging system. We recommend discussing payment methods and terms before finalizing any transaction."
    },
    {
      question: "Can I edit or delete my product listings?",
      answer: "Yes, you can manage all your product listings from your store dashboard. You can edit details, update prices, add more photos, or deactivate products at any time."
    },
    {
      question: "How do I report a problem with a seller or product?",
      answer: "If you encounter any issues, you can contact our support team at support@jikagri.co.ke. We take all reports seriously and will investigate accordingly."
    },
    {
      question: "Can I see reviews of sellers before buying?",
      answer: "We're working on implementing a review system. Currently, you can check a seller's store page to see their product range and store information to help make informed decisions."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your profile page by clicking on 'Account' in the header menu and selecting 'Profile'. There you can update your personal information, contact details, and preferences."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about using Jikagri
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a 
              href="mailto:support@jikagri.co.ke"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
