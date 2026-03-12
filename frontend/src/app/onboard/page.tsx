"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mic, Upload, ArrowRight, Loader2,
    CheckCircle2, FileText, Zap, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEMO_PROFILES } from "@/lib/eligibilityEngine";

interface Profile {
    name: string;
    age: string;
    gender: string;
    state: string;
    occupation: string;
    income: string;
    category: string;
    landOwner: boolean;
    studentStatus: boolean;
    familySize: string;
}

interface FieldProps {
    label: string;
    req?: boolean;
    children: React.ReactNode;
}

const Field = ({ label, req, children }: FieldProps) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            {label}
            {req && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
    "Ladakh", "Puducherry",
];

const OCCUPATIONS = [
    "Farmer", "Agricultural Laborer", "Self-employed", "Salaried Employee",
    "Daily Wage Worker", "Artisan/Craftsperson", "Carpenter", "Blacksmith",
    "Weaver", "Tailor", "Potter", "Cobbler", "Student", "Unemployed",
    "Homemaker", "Other",
];

const MODES = [
    { id: "form", icon: User, label: "Fill Form", sub: "Type your details" },
    { id: "voice", icon: Mic, label: "Speak", sub: "Voice in Hindi/English" },
    { id: "doc", icon: Upload, label: "Upload Doc", sub: "Aadhaar / Income cert" },
];

const DEMOS = [
    { key: "farmer", label: "Ravi Kumar", sub: "Farmer · Bihar", emoji: "🌾" },
    { key: "student", label: "Priya Sharma", sub: "Student · Tamil Nadu", emoji: "🎓" },
    { key: "artisan", label: "Mohd. Rafiq", sub: "Artisan · Uttar Pradesh", emoji: "🔨" },
];

const EMPTY: Profile = {
    name: "",
    age: "",
    gender: "male",
    state: "Tamil Nadu",
    occupation: "",
    income: "",
    category: "general",
    landOwner: false,
    studentStatus: false,
    familySize: "4",
};

export default function OnboardPage() {

    const router = useRouter();

    const [mode, setMode] = useState("form");
    const [profile, setProfile] = useState<Profile>(EMPTY);
    const [loading, setLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrDone, setOcrDone] = useState(false);
    const [voiceActive, setVoiceActive] = useState(false);

    const up = (k: keyof Profile, v: string | boolean) =>
        setProfile(p => ({ ...p, [k]: v }));

    const loadDemo = (key: string) => {
        const raw = DEMO_PROFILES[key as keyof typeof DEMO_PROFILES];

        setProfile({
            name: raw.name || "",
            age: String(raw.age || ""),
            gender: raw.gender || "male",
            state: raw.state || "Tamil Nadu",
            occupation: raw.occupation || "",
            income: String(raw.income || ""),
            category: raw.category || "general",
            landOwner: raw.landOwner ?? false,
            studentStatus: raw.studentStatus ?? false,
            familySize: String(raw.familySize || 4),
        });
    };

    const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files?.[0]) return;

        setOcrLoading(true);

        await new Promise(r => setTimeout(r, 2200));

        setProfile(p => ({
            ...p,
            name: "Ravi Kumar",
            age: "42",
            gender: "male",
            state: "Bihar",
            occupation: "Farmer",
            income: "85000",
            category: "obc",
            landOwner: true,
        }));

        setOcrDone(true);
        setOcrLoading(false);
        setMode("form");
    };

    const simulateVoice = () => {

        setVoiceActive(true);

        setTimeout(() => {

            setProfile(p => ({
                ...p,
                name: "Lakshman Singh",
                occupation: "Farmer",
                state: "Rajasthan",
                income: "60000",
                landOwner: true
            }));

            setVoiceActive(false);
            setMode("form");

        }, 3000);
    };

    const handleSubmit = async () => {

        if (!profile.name || !profile.age || !profile.state) return;

        setLoading(true);

        await new Promise(r => setTimeout(r, 800));

        sessionStorage.setItem("userProfile", JSON.stringify({
            name: profile.name,
            age: parseInt(profile.age),
            gender: profile.gender,
            state: profile.state,
            occupation: profile.occupation,
            income: parseFloat(profile.income) || 0,
            category: profile.category,
            land_owner: profile.landOwner,
            student_status: profile.studentStatus,
            family_size: parseInt(profile.familySize),
        }));

        router.push("/dashboard");
    };

    const valid = profile.name && profile.age && profile.state;

    return (
        <div className="min-h-screen py-8 px-4 bg-grid">

            <div className="max-w-2xl mx-auto">

                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black mb-3">
                        <span className="text-white">Tell Us About </span>
                        <span className="gradient-text">Yourself</span>
                    </h1>

                    <p className="text-slate-400">
                        We'll match you with every scheme you qualify for. Takes under 2 minutes.
                    </p>
                </div>

                <div className="flex gap-2 mb-5 p-1 rounded-2xl glass border border-white/6">

                    {MODES.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m.id
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <m.icon className="w-4 h-4" />
                            <span className="hidden sm:block">{m.label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {mode === "form" && (

                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                        >

                            <div className="card-no-hover rounded-2xl p-6">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <Field label="Full Name" req>
                                        <input
                                            className="input-field"
                                            placeholder="e.g. Ravi Kumar"
                                            value={profile.name}
                                            onChange={e => up("name", e.target.value)}
                                        />
                                    </Field>

                                    <Field label="Age" req>
                                        <input
                                            className="input-field"
                                            type="number"
                                            placeholder="e.g. 35"
                                            value={profile.age}
                                            onChange={e => up("age", e.target.value)}
                                        />
                                    </Field>

                                    <Field label="Gender">
                                        <select
                                            className="input-field"
                                            value={profile.gender}
                                            onChange={e => up("gender", e.target.value)}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </Field>

                                    <Field label="State / UT" req>
                                        <select
                                            className="input-field"
                                            value={profile.state}
                                            onChange={e => up("state", e.target.value)}
                                        >
                                            {STATES.map(s => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                </div>

                                <div className="mt-6">

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!valid || loading}
                                        className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-40 justify-center"
                                    >

                                        {loading
                                            ? <Loader2 className="w-5 h-5 animate-spin" />
                                            : <FileText className="w-5 h-5" />
                                        }

                                        {loading
                                            ? "Matching Schemes..."
                                            : "Find My Eligible Schemes"
                                        }

                                        {!loading && <ArrowRight className="w-4 h-4" />}

                                    </button>

                                    {!valid && (
                                        <p className="text-xs text-slate-600 text-center mt-2">
                                            Please fill in Name, Age, and State
                                        </p>
                                    )}

                                </div>

                            </div>

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>

        </div>
    );
}
