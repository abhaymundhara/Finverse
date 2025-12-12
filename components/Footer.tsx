"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <motion.h3
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              we need.
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                money
              </span>
            </motion.h3>
            <p className="text-gray-400 max-w-md">
              Your personal finance playground. Calculate, track, and master
              your money with AI-powered insights.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Calculators</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  FIRE Calculator
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Savings Runway
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Net Worth
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  SIP Calculator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 weneed.money. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
