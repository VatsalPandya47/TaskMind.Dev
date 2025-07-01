import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small teams",
      popular: false,
      features: [
        "Up to 10 meetings per month",
        "Basic AI summaries",
        "Task extraction",
        "Email support",
        "1 user"
      ]
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing teams and businesses",
      popular: true,
      features: [
        "Up to 100 meetings per month",
        "Advanced AI summaries",
        "Task extraction & management",
        "Memory search",
        "Priority support",
        "Up to 10 users",
        "Custom integrations"
      ]
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations with advanced needs",
      popular: false,
      features: [
        "Unlimited meetings",
        "Custom AI models",
        "Advanced analytics",
        "Dedicated support",
        "Unlimited users",
        "Custom integrations",
        "API access",
        "On-premise deployment"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300">
            Choose the plan that's right for your team. All plans include our core AI features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-200 hover:shadow-2xl ${plan.popular ? 'border-purple-500/50 scale-105 shadow-2xl' : 'border-gray-700/50 hover:border-gray-600/50'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="p-1 bg-green-500/20 rounded-full">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full py-3 ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl' : 'bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600/50 hover:border-gray-500/50'}`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Need a custom plan? Contact us for enterprise pricing.
          </p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
