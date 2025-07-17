import { Star, Clock, ThumbsUp, Users } from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: <Star className="w-8 h-8 text-indigo-500" />,
      title: "Uniquely Crafted Spaces",
      description:
        "We create uniquely crafted spaces that capture your identity and lifestyle, blending creativity with precision to deliver interiors that feel truly personal and inspiring.",
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-500" />,
      title: "Reliable Turnaround Time",
      description:
        "We provide a reliable turnaround time, ensuring your project progresses smoothly and is completed within the agreed schedule without sacrificing quality.",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-indigo-500" />,
      title: "Happy Clients, Beautiful Spaces",
      description:
        "Your happiness is the foundation of our process. We believe that great design is about more than just aesthetics, it's about creating spaces that truly make you feel at home.",
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "Passionate Design Team",
      description:
        "We're a passionate team dedicated to designing spaces you'll love. Every detail is crafted with care and creativity to make your home truly yours.",
    },
  ];

  return (
    <div id="about" className="bg-slate-50 min-h-screen flex items-center py-24">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-indigo-300 uppercase tracking-wider mb-4">
            ABOUT US
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Learn more about our{" "}
            <span className="text-indigo-500">passion</span> and{" "}
            <span className="text-indigo-500">expertise</span>
          </h3>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border-2 border-indigo-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-indigo-600 leading-snug">
                  {feature.title}
                </h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}