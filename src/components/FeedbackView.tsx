import React, { useState } from "react";
import { Star, Mail, Phone, MapPin, Send, MessageSquare, ThumbsUp, ShieldCheck } from "lucide-react";
import { FeedbackReview } from "../types";

interface FeedbackViewProps {
  role: string;
  onAddReview: (review: Omit<FeedbackReview, "id" | "date">) => void;
  reviews: FeedbackReview[];
}

export default function FeedbackView({ role, onAddReview, reviews }: FeedbackViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }
    onAddReview({
      name,
      email,
      role: role.toUpperCase(),
      rating,
      subject,
      message
    });
    setName("");
    setEmail("");
    setRating(5);
    setSubject("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          Review, Feedback & Support Center
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mt-1">
          Have questions about your carbon audit or need operational support? Send us a direct inquiry or submit an official review of your Carbon Cutters experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Contact Channels
          </h3>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Operational Support</p>
                <p className="text-slate-500 mt-0.5">support@carboncutters.com</p>
                <p className="text-[10px] text-slate-400 font-mono">Response within 4 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Audit Compliance Hotline</p>
                <p className="text-slate-500 mt-0.5">+1 (800) 555-CC-ESG</p>
                <p className="text-[10px] text-slate-400 font-mono">Mon-Fri • 9:00 AM - 6:00 PM UTC</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">HQ Address</p>
                <p className="text-slate-500 leading-normal mt-0.5">
                  Carbon Cutters Ltd, Level 14, Eco Towers,<br />
                  Sustainability Boulevard, London EC2A
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[10px] text-slate-500 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                All feedback and system logs are cryptographically sealed and checked against standard ISO 14064 feedback protocols to preserve audit integrity.
              </span>
            </div>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
            Submit Your Feedback & System Review
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 font-mono">YOUR NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 font-mono">BUSINESS EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh@precisionmfg.com"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 font-mono">SUBJECT / MODULE</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. CNC Telemetry Accuracy"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 font-mono">RATING INDICATOR</label>
                <div className="flex items-center gap-1.5 h-[34px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[11px] font-mono font-bold text-slate-500 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 font-mono">FEEDBACK DETAILS</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your experience, bug reports, feature suggestions or verification queries..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 h-28 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                required
              />
            </div>

            {submitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-mono">
                ✓ Feedback submitted successfully! It has been logged into the Carbon Cutters ledger.
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              SUBMIT SYSTEM AUDIT REVIEW
            </button>
          </form>
        </div>
      </div>

      {/* Existing reviews section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          Recent Auditor & Operator Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-200/60 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{rev.subject}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      By {rev.name} • <span className="font-mono text-emerald-600 text-[9px] font-bold">{rev.role}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-normal italic">
                  "{rev.message}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-mono">
                <span>Verified Client Invoice</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
