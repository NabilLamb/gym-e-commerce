"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import {
    MapPin, Phone, Mail, Clock,
    ChevronRight, Send, CheckCircle2, XCircle,
} from "lucide-react"
import { validateName, validateEmail } from "@/lib/validations"

const CONTACT_INFO = [
    {
        icon: MapPin,
        label: "Address",
        value: "123 Fitness Boulevard, Athletic District",
        sub: "Casablanca, Morocco 20000",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+212 522-000-000",
        sub: "Mon–Sat, 6:00 AM – 10:00 PM",
    },
    {
        icon: Mail,
        label: "Email",
        value: "contact@fithub.ma",
        sub: "We reply within 24 hours",
    },
    {
        icon: Clock,
        label: "Hours",
        value: "Mon – Fri: 6:00 AM – 10:00 PM",
        sub: "Sat – Sun: 8:00 AM – 8:00 PM",
    },
]

export function ContactClient() {
    const { user } = useAuth()
    const { toast } = useToast()

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        const nameErr = validateName(form.name)
        if (nameErr) newErrors.name = nameErr

        const emailErr = validateEmail(form.email)
        if (emailErr) newErrors.email = emailErr

        if (!form.subject.trim() || form.subject.trim().length < 3)
            newErrors.subject = "Subject must be at least 3 characters."

        if (!form.message.trim() || form.message.trim().length < 10)
            newErrors.message = "Message must be at least 10 characters."

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to send message.")
            }

            setSubmitted(true)
            toast({
                title: "Message sent!",
                description: "Thank you for reaching out! Your message has been received, and we’ll get back to you as soon as possible.",
            })
        } catch (error: any) {
            toast({
                title: "Failed to send",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-background relative pb-24">
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-background to-background -z-10" />

            {/* Breadcrumb */}
            <div className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-40">
                <div className="container max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">Contact</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <section className="py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl font-medium">
                        Have a question about our products or services? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="pb-16">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Contact Info */}
                        <div className="space-y-6">
                            {CONTACT_INFO.map((item) => (
                                <Card key={item.label} className="athletic-card border-border/50">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                                {item.label}
                                            </p>
                                            <p className="font-semibold text-sm">{item.value}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Map placeholder */}
                            <Card className="athletic-card border-border/50 overflow-hidden">
                                <div className="h-48 bg-secondary relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5" />
                                    <div className="text-center relative z-10">
                                        <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                                        <p className="text-sm font-semibold">FitHub Casablanca</p>
                                        <p className="text-xs text-muted-foreground">123 Fitness Boulevard</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="athletic-card border-border/50">
                                <CardContent className="p-8">
                                    {submitted ? (
                                        <div className="text-center py-12">
                                            <div className="flex justify-center mb-6">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                                                    <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-extrabold mb-3">Message Sent!</h2>
                                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                Thank you for reaching out. Our team will get back to you within 24 hours.
                                            </p>
                                            <Button
                                                onClick={() => {
                                                    setSubmitted(false)
                                                    setForm({ name: user?.name || "", email: user?.email || "", subject: "", message: "" })
                                                }}
                                                variant="outline"
                                                className="cursor-pointer"
                                            >
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-extrabold mb-6 tracking-tight">
                                                Send us a Message
                                            </h2>
                                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="name">Full Name</Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            value={form.name}
                                                            onChange={handleChange}
                                                            placeholder="John Doe"
                                                            className={errors.name ? "border-destructive" : ""}
                                                        />
                                                        {errors.name && (
                                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                                <XCircle className="w-3 h-3" /> {errors.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={form.email}
                                                            onChange={handleChange}
                                                            placeholder="you@example.com"
                                                            className={errors.email ? "border-destructive" : ""}
                                                        />
                                                        {errors.email && (
                                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                                <XCircle className="w-3 h-3" /> {errors.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="subject">Subject</Label>
                                                    <Input
                                                        id="subject"
                                                        name="subject"
                                                        value={form.subject}
                                                        onChange={handleChange}
                                                        placeholder="How can we help you?"
                                                        className={errors.subject ? "border-destructive" : ""}
                                                    />
                                                    {errors.subject && (
                                                        <p className="text-xs text-destructive flex items-center gap-1">
                                                            <XCircle className="w-3 h-3" /> {errors.subject}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="message">Message</Label>
                                                    <Textarea
                                                        id="message"
                                                        name="message"
                                                        value={form.message}
                                                        onChange={handleChange}
                                                        placeholder="Tell us more about your question or request..."
                                                        rows={6}
                                                        className={`resize-none ${errors.message ? "border-destructive" : ""}`}
                                                    />
                                                    <div className="flex justify-between items-center">
                                                        {errors.message ? (
                                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                                <XCircle className="w-3 h-3" /> {errors.message}
                                                            </p>
                                                        ) : (
                                                            <span />
                                                        )}
                                                        <span className={`text-xs text-muted-foreground ${form.message.length > 450 ? "text-yellow-500" : ""}`}>
                                                            {form.message.length}/500
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    size="lg"
                                                    className="w-full cursor-pointer"
                                                    disabled={submitting}
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4 mr-2" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}