import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ADOPTION_DATA } from '../constants';
import { Language, TranslationStrings } from '../types';

interface StatsSectionProps {
  dict: TranslationStrings;
  lang: Language;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ dict, lang }) => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute -left-20 top-20 w-64 h-64 bg-paw-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-accent-yellow/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-paw-900 leading-tight">
              {dict.stats.title}
            </h2>
            <p className="text-lg text-paw-600 leading-relaxed">
              {lang === 'EN' 
                ? "Every number represents a life changed. Thanks to our amazing community, we've been able to connect hundreds of pets with loving families this year alone. We believe in transparency and celebrating every small victory."
                : "Her sayı değişen bir hayatı temsil eder. Harika topluluğumuz sayesinde, sadece bu yıl yüzlerce evcil hayvanı sevgi dolu ailelerle buluşturabildik. Şeffaflığa ve her küçük zaferi kutlamaya inanıyoruz."}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-paw-50 rounded-3xl border border-paw-100">
                 <div className="text-4xl font-display font-bold text-accent-teal mb-2">1,240+</div>
                 <div className="text-paw-600 font-semibold">{dict.hero.stat_1}</div>
               </div>
               <div className="p-6 bg-paw-50 rounded-3xl border border-paw-100">
                 <div className="text-4xl font-display font-bold text-accent-orange mb-2">45</div>
                 <div className="text-paw-600 font-semibold">{dict.hero.stat_2}</div>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-80 md:h-96 bg-white p-6 rounded-3xl shadow-xl shadow-paw-200/50 border border-paw-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADOPTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2e8e5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8a7266', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8a7266', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#fdf8f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
                  itemStyle={{ color: '#5e4e46', fontWeight: 700 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {ADOPTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FF9F1C' : '#2EC4B6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4 text-sm font-bold text-paw-500 uppercase tracking-widest">
              {dict.stats.chart_label} (2023)
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};