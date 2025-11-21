import React from 'react';
import { Heart, Info } from 'lucide-react';
import { Animal, Language } from '../types';

interface AnimalCardProps {
  animal: Animal;
  lang: Language;
  onClick: (animal: Animal) => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, lang, onClick }) => {
  const description = lang === 'EN' ? animal.description_en : animal.description_tr;
  const tags = lang === 'EN' ? animal.tags_en : animal.tags_tr;

  return (
    <div 
      className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-paw-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-paw-300/50 cursor-pointer"
      onClick={() => onClick(animal)}
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <img 
          src={animal.image} 
          alt={animal.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badge */}
        {animal.adopted && (
          <div className="absolute top-4 right-4 z-20 bg-accent-teal text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            {lang === 'EN' ? 'Adopted' : 'Sahiplenildi'}
          </div>
        )}

        {/* Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-display text-3xl font-bold mb-1">{animal.name}</h3>
          <p className="text-paw-100 text-sm font-medium opacity-90">{animal.breed} • {animal.age}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-paw-50 text-paw-600 text-xs font-bold rounded-full border border-paw-100">
              {tag}
            </span>
          ))}
        </div>
        
        <p className="text-paw-600 text-sm line-clamp-2 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-paw-100">
          <button className="p-2 rounded-full text-paw-400 hover:bg-pink-50 hover:text-accent-rose transition-colors">
            <Heart size={24} />
          </button>
          <div className="flex items-center text-accent-orange font-bold text-sm group-hover:translate-x-1 transition-transform duration-300">
             {lang === 'EN' ? 'Meet Me' : 'Tanışalım'} <Info size={16} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};