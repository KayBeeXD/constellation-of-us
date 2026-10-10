import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StarNode, LoveLetterContent } from '../types';
import { X, Save, Sparkles } from 'lucide-react';
import { saveStoredStars, saveStoredLetter } from '../data/quotes';

interface CustomizeDrawerProps {
  stars: StarNode[];
  letter: LoveLetterContent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStars: StarNode[], newLetter: LoveLetterContent) => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  stars,
  letter,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editableStars, setEditableStars] = useState<StarNode[]>(stars);
  const [editableLetter, setEditableLetter] = useState<LoveLetterContent>(letter);
  const [activeTab, setActiveTab] = useState<'STARS' | 'LETTER'>('STARS');

  if (!isOpen) return null;

  const handleStarChange = (id: number, field: keyof StarNode, value: string) => {
    setEditableStars(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    saveStoredStars(editableStars);
    saveStoredLetter(editableLetter);
    onSave(editableStars, editableLetter);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-xl h-full glass-card border-l border-amber-300/30 text-white p-4 sm:p-6 overflow-y-auto flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-amber-300/20 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h2 className="font-playfair text-xl font-bold text-amber-200">
                  Customize Constellation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-amber-200 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/60 border border-amber-300/20 mb-6">
              <button
                onClick={() => setActiveTab('STARS')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'STARS'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Star Quotes ({editableStars.length})
              </button>
              <button
                onClick={() => setActiveTab('LETTER')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'LETTER'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Love Letter 💌
              </button>
            </div>

            {/* Tab 1: Star Quotes Editor */}
            {activeTab === 'STARS' && (
              <div className="space-y-6">
                {editableStars.map((star, idx) => (
                  <div
                    key={star.id}
                    className="p-4 rounded-xl bg-slate-900/50 border border-amber-300/15 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-300">
                        Star #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={star.name}
                        onChange={(e) => handleStarChange(star.id, 'name', e.target.value)}
                        placeholder="Star Name"
                        className="bg-slate-800/80 border border-amber-300/30 rounded px-2.5 py-1 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Quote / Memory Text:
                      </label>
                      <textarea
                        rows={2}
                        value={star.quote}
                        onChange={(e) => handleStarChange(star.id, 'quote', e.target.value)}
                        className="w-full bg-slate-800/80 border border-amber-300/20 rounded p-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Optional Detail Reflection:
                      </label>
                      <input
                        type="text"
                        value={star.detail || ''}
                        onChange={(e) => handleStarChange(star.id, 'detail', e.target.value)}
                        className="w-full bg-slate-800/80 border border-amber-300/20 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Love Letter Editor */}
            {activeTab === 'LETTER' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Letter Header / Title:
                  </label>
                  <input
                    type="text"
                    value={editableLetter.title}
                    onChange={(e) => setEditableLetter({ ...editableLetter, title: e.target.value })}
                    className="w-full bg-slate-900/80 border border-amber-300/30 rounded p-2 text-xs text-amber-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Salutation:
                  </label>
                  <input
                    type="text"
                    value={editableLetter.salutation}
                    onChange={(e) => setEditableLetter({ ...editableLetter, salutation: e.target.value })}
                    className="w-full bg-slate-900/80 border border-amber-300/30 rounded p-2 text-xs text-amber-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Letter Body Paragraphs (separated by new lines):
                  </label>
                  <textarea
                    rows={6}
                    value={editableLetter.bodyParagraphs.join('\n\n')}
                    onChange={(e) =>
                      setEditableLetter({
                        ...editableLetter,
                        bodyParagraphs: e.target.value.split('\n\n').filter(p => p.trim().length > 0),
                      })
                    }
                    className="w-full bg-slate-900/80 border border-amber-300/30 rounded p-2.5 text-xs text-amber-100 leading-relaxed font-cormorant"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">
                      Closing Sign-off:
                    </label>
                    <input
                      type="text"
                      value={editableLetter.closing}
                      onChange={(e) => setEditableLetter({ ...editableLetter, closing: e.target.value })}
                      className="w-full bg-slate-900/80 border border-amber-300/30 rounded p-2 text-xs text-amber-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">
                      Cursive Signature:
                    </label>
                    <input
                      type="text"
                      value={editableLetter.signature}
                      onChange={(e) => setEditableLetter({ ...editableLetter, signature: e.target.value })}
                      className="w-full bg-slate-900/80 border border-amber-300/30 rounded p-2 text-xs text-amber-100 font-script text-base"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 sm:pt-6 border-t border-amber-300/20 mt-4 sm:mt-6 flex items-center justify-end gap-3">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(243,229,171,0.5)] transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Constellation ✨</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
