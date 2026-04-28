/**
 * KanjiVibe — Sentence Builder Screen
 * Interactive slot-based sentence construction for daily routines
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, RotateCcw, Check, ChevronDown, Sparkles } from 'lucide-react-native';
import { Colors, Radius, Glass } from '../constants/theme';
import { FontFamily } from '../constants/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { useApp } from '../context/AppContext';
import { sentenceTemplates, SentenceTemplate, SentenceSlot } from '../data/sentences';

function SentenceBuilderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const template = sentenceTemplates[selectedTemplate];

  const selectOption = (slotId: string, optionIndex: number) => {
    setSelectedOptions(prev => ({ ...prev, [slotId]: optionIndex }));
    setExpandedSlot(null);
  };

  const resetSelections = () => {
    setSelectedOptions({});
    setExpandedSlot(null);
  };

  // Build the sentence from selections
  const buildSentence = () => {
    const parts: { japanese: string; romaji: string; english: string }[] = [];
    let allSelected = true;

    template.slots.forEach(slot => {
      const idx = selectedOptions[slot.id];
      if (idx !== undefined) {
        const opt = slot.options[idx];
        parts.push({ japanese: opt.kanji, romaji: opt.romaji, english: opt.english });
      } else {
        allSelected = false;
        parts.push({ japanese: `[${slot.label}]`, romaji: `[${slot.label}]`, english: `[${slot.label}]` });
      }
    });

    return { parts, allSelected };
  };

  const { parts, allSelected } = buildSentence();

  const slotTypeColors: Record<string, string> = {
    subject: Colors.primary,
    time: Colors.secondary,
    place: Colors.tertiary,
    object: '#00dbe9',
    verb: '#ecb2ff',
    particle: Colors.onSurfaceVariant,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sentence Builder</Text>
        <TouchableOpacity onPress={resetSelections} style={styles.resetBtn}>
          <RotateCcw size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Template Selector */}
        <View>
          <Text style={styles.sectionLabel}>TEMPLATE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {sentenceTemplates.map((tmpl, i) => (
              <TouchableOpacity
                key={tmpl.id}
                style={[styles.templateChip, selectedTemplate === i && styles.templateChipActive]}
                onPress={() => { setSelectedTemplate(i); resetSelections(); }}
              >
                <Text style={[styles.templateChipKanji, selectedTemplate === i && { color: Colors.primary }]}>
                  {tmpl.title}
                </Text>
                {state.showRomaji && (
                  <Text style={styles.templateChipRomaji}>{tmpl.titleRomaji}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Preview */}
        <View>
          <GlassCard glow={allSelected ? 'purple' : 'none'} style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Sparkles size={16} color={Colors.primary} />
              <Text style={styles.previewLabel}>SENTENCE PREVIEW</Text>
            </View>
            <Text style={styles.previewJapanese}>
              {parts.map((p, i) => p.japanese).join('')}
            </Text>
            {state.showRomaji && (
              <Text style={styles.previewRomaji}>
                {parts.map(p => p.romaji).join(' ')}
              </Text>
            )}
            {allSelected && (
              <Text style={styles.previewEnglish}>
                {parts.map(p => p.english).join(' ')}
              </Text>
            )}
            {/* Pattern reference */}
            <View style={styles.patternRow}>
              <Text style={styles.patternLabel}>Pattern: </Text>
              <Text style={styles.patternText}>{template.pattern}</Text>
            </View>
          </GlassCard>
        </View>

        {/* Slots */}
        <View>
          <Text style={styles.sectionLabel}>BUILD YOUR SENTENCE</Text>
          <Text style={styles.sectionDesc}>{template.description}</Text>

          <View style={styles.slotsContainer}>
            {template.slots.map((slot, slotIndex) => {
              const isExpanded = expandedSlot === slot.id;
              const selectedIdx = selectedOptions[slot.id];
              const selectedOption = selectedIdx !== undefined ? slot.options[selectedIdx] : null;
              const color = slotTypeColors[slot.type] || Colors.primary;

              return (
                <View
                  key={slot.id}
                >
                  {/* Slot header */}
                  <TouchableOpacity
                    style={[styles.slotHeader, { borderLeftColor: color }]}
                    onPress={() => setExpandedSlot(isExpanded ? null : slot.id)}
                    activeOpacity={0.7}
                  >
                    <View>
                      <Text style={[styles.slotType, { color }]}>
                        {slot.type.toUpperCase()}
                      </Text>
                      <Text style={styles.slotLabel}>{slot.label}</Text>
                    </View>

                    {selectedOption ? (
                      <View style={styles.selectedPill}>
                        <Text style={styles.selectedKanji}>{selectedOption.kanji}</Text>
                        {state.showRomaji && (
                          <Text style={styles.selectedRomaji}>({selectedOption.romaji})</Text>
                        )}
                      </View>
                    ) : (
                      <ChevronDown size={18} color={Colors.onSurfaceVariant} />
                    )}
                  </TouchableOpacity>

                  {/* Options dropdown */}
                  {isExpanded && (
                    <View style={styles.optionsWrap}>
                      {slot.options.map((opt, optIdx) => (
                        <TouchableOpacity
                          key={optIdx}
                          style={[
                            styles.optionRow,
                            selectedIdx === optIdx && { backgroundColor: `${color}15` },
                          ]}
                          onPress={() => selectOption(slot.id, optIdx)}
                        >
                          <View style={styles.optionLeft}>
                            <Text style={[styles.optionKanji, { color }]}>{opt.kanji}</Text>
                            <View>
                              <Text style={styles.optionHiragana}>{opt.hiragana}</Text>
                              {state.showRomaji && (
                                <Text style={styles.optionRomaji}>{opt.romaji}</Text>
                              )}
                            </View>
                          </View>
                          <Text style={styles.optionEnglish}>{opt.english}</Text>
                          {selectedIdx === optIdx && <Check size={16} color={color} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Complete button */}
        {allSelected && (
          <View>
            <NeonButton
              label="Sentence Complete! ✨"
              onPress={() => {}}
              fullWidth
              style={{ marginTop: 8 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default SentenceBuilderScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { fontFamily: FontFamily.headline, fontSize: 20, color: Colors.onSurface },
  resetBtn: { width: 40, height: 40, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },

  content: { paddingHorizontal: 20, gap: 24 },
  sectionLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, letterSpacing: 2, color: Colors.onSurfaceVariant, marginBottom: 10 },
  sectionDesc: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurfaceVariant, marginTop: -6, marginBottom: 12 },

  // Template chips
  templateChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: Radius.xl, backgroundColor: Colors.surfaceContainerLow, borderWidth: 1, borderColor: 'transparent' },
  templateChipActive: { borderColor: `${Colors.primary}40`, backgroundColor: `${Colors.primary}10` },
  templateChipKanji: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, color: Colors.onSurface },
  templateChipRomaji: { fontFamily: FontFamily.label, fontSize: 10, color: Colors.onSurfaceVariant, marginTop: 2 },

  // Preview
  previewCard: {},
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  previewLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, letterSpacing: 2, color: Colors.primary },
  previewJapanese: { fontFamily: FontFamily.headline, fontSize: 22, color: Colors.onSurface, lineHeight: 32, marginBottom: 4 },
  previewRomaji: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.primary, fontStyle: 'italic', marginBottom: 4 },
  previewEnglish: { fontFamily: FontFamily.body, fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 12 },
  patternRow: { flexDirection: 'row', marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  patternLabel: { fontFamily: FontFamily.labelBold, fontSize: 10, color: Colors.onSurfaceVariant },
  patternText: { fontFamily: FontFamily.label, fontSize: 10, color: Colors.onSurfaceVariant },

  // Slots
  slotsContainer: { gap: 8 },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.lg,
    borderLeftWidth: 3,
  },
  slotType: { fontFamily: FontFamily.labelBold, fontSize: 9, letterSpacing: 1.5 },
  slotLabel: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Colors.onSurface, marginTop: 2 },
  selectedPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  selectedKanji: { fontFamily: FontFamily.headline, fontSize: 16, color: Colors.onSurface },
  selectedRomaji: { fontFamily: FontFamily.label, fontSize: 11, color: Colors.onSurfaceVariant },

  // Options
  optionsWrap: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.lg,
    marginTop: 4,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionKanji: { fontFamily: FontFamily.headline, fontSize: 20, width: 50 },
  optionHiragana: { fontFamily: FontFamily.body, fontSize: 13, color: Colors.onSurface },
  optionRomaji: { fontFamily: FontFamily.label, fontSize: 10, color: Colors.primary, marginTop: 1 },
  optionEnglish: { fontFamily: FontFamily.body, fontSize: 12, color: Colors.onSurfaceVariant, flex: 1, textAlign: 'right', marginRight: 8 },
});
