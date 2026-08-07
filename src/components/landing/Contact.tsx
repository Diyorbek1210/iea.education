import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

const details = [
  { icon: Mail, label: "Email", value: "hello@iea-academy.uz" },
  { icon: Phone, label: "Phone", value: "+998 90 000 00 00" },
  { icon: MapPin, label: "Location", value: "Tashkent, Uzbekistan (online worldwide)" },
];

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    toast.success("Thanks! We'll get back to you shortly.");
    setValues({ name: "", email: "", message: "" });
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-20">
      <div className="grid gap-10 rounded-4xl bg-card p-8 shadow-soft lg:grid-cols-2 lg:p-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Questions before you start?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Write to us and the IEA team will answer within one working day. Or skip ahead —
            take the placement test and start learning right now.
          </p>

          <ul className="mt-8 space-y-4">
            {details.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <item.icon className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button asChild variant="hero" size="pill" className="mt-8">
            <Link to="/test">Start placement test</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-secondary/60 p-6">
          <div>
            <Label htmlFor="c-name">Full name</Label>
            <Input
              id="c-name"
              value={values.name}
              maxLength={100}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Your name"
              className="mt-1.5 bg-background"
            />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              type="email"
              value={values.email}
              maxLength={255}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              placeholder="you@example.com"
              className="mt-1.5 bg-background"
            />
          </div>
          <div>
            <Label htmlFor="c-message">Message</Label>
            <Textarea
              id="c-message"
              rows={5}
              value={values.message}
              maxLength={1000}
              onChange={(e) => setValues({ ...values, message: e.target.value })}
              placeholder="How can we help?"
              className="mt-1.5 bg-background"
            />
          </div>
          <Button type="submit" variant="hero" size="pill" className="w-full">
            Send message <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
