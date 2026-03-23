"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CtaSection() {
  return (
    <section className="p-12 lg:p-24 border-b-4 border-white text-center bg-[#ef4444] text-black relative z-10">
      <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-10 leading-none font-landing-headline">
        ACCEDE AL FUTURO DE LA<br />GESTIÓN MÉDICA
      </h2>
      <p className="font-landing-body text-base lg:text-lg font-bold mb-12 max-w-3xl mx-auto uppercase tracking-tighter border-y-2 border-black/20 py-4">
        INGRESA CON CREDENCIALES AUTORIZADAS PARA GESTIONAR EL INVENTARIO, REVISAR LOGS DE AUDITORÍA INMUTABLES Y CONTROLAR TODOS LOS MÓDULOS DE DONANTES.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <Link
          href="/login"
          className="bg-black text-[#ef4444] text-2xl lg:text-3xl font-landing-headline px-12 lg:px-16 py-6 lg:py-8 border-4 border-black hover:bg-white hover:text-black transition-all inline-flex items-center gap-4 font-bold"
        >
          <ShieldCheck className="w-6 h-6" />
          INICIAR AHORA
        </Link>
        <a
          href="https://github.com/FdevMX/blood-bank"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl lg:text-2xl font-bold underline underline-offset-8 flex items-center gap-4 hover:bg-black hover:text-[#ef4444] px-4 py-2 transition-all"
        >
          VER PROYECTO EN GITHUB
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
