/**
 * Everything you may want to personalise lives here.
 * Add your school name and it will appear in the letter, hero and footer.
 */
export const site = {
  principal: "Respected Mrs. Gupta",
  principalShort: "Mrs. Gupta",
  from: "Your Life Skill Committee",
  school: "", // e.g. "Sunrise Public School" — leave empty to hide

  diwaliISO: "2026-11-08T18:30:00+05:30",
  diwaliLabel: "8 November 2026",
  year: "2026",

  letter: {
    greeting: "Respected Mrs. Gupta,",
    paragraphs: [
      "On this festival of lights, we wanted to give you something that would not be folded away in a drawer. So we made you a little corner of the internet — every diya on it lit by your Life Skill Committee.",
      "Every day, you light paths for us. You notice the quiet student, you make room for the second chance, and you keep the school's heart steady even on the days the timetable refuses to behave. That kind of light is easy to get used to — and far too rarely thanked.",
      "This Diwali, we hope some of that light comes home to you. May your house be full of laughter, your table full of sweets, and your year ahead full of the good news you have quietly earned.",
      "May Maa Lakshmi bless your doorstep, Maa Saraswati bless your words, and may the lamps you have lit in all of us never, ever go out.",
    ],
    closing: "With gratitude, respect and a little extra light,",
    signature: "Your Life Skill Committee",
  },

  blessings: [
    {
      hindi: "आपने जो दीये जलाए, वे आपके आँगन में उजास लाएँ।",
      text: "May every lamp you have lit for us find its way home to you — a hundred times brighter.",
    },
    {
      hindi: "हँसी, मिठाई और अपनों का साथ — यही रहे आपके हर घर में।",
      text: "May your home overflow with laughter, something sweet, and the people you love most.",
    },
    {
      hindi: "माँ लक्ष्मी का आशीर्वाद, माँ सरस्वती का ज्ञान।",
      text: "May Maa Lakshmi bring abundance and Maa Saraswati bring wisdom to everything you do.",
    },
    {
      hindi: "हर सुबह नई उम्मीद, हर शाम नई रौनक लेकर आए।",
      text: "May every morning arrive with hope, and every evening with a reason to smile.",
    },
    {
      hindi: "आपके चेहरे की मुस्कान सदा बनी रहे।",
      text: "May the smile you give so freely always have a way of finding you again.",
    },
    {
      hindi: "जो उजाला आपने बोया, वह दुगुना होकर लौटे।",
      text: "May the light you have sown in your Life Skill Committee return to you doubled.",
    },
  ],

  fiveDays: [
    {
      name: "Dhanteras",
      hindi: "धनतेरस",
      sub: "Day one",
      text: "The festival opens with a clean house and one small new thing — often a clay diya or a brass pot — brought home as a promise of plenty.",
    },
    {
      name: "Naraka Chaturdashi",
      hindi: "नरक चतुर्दशी",
      sub: "Choti Diwali",
      text: "Lamps are lit before sunrise in some homes. The day remembers Narakasura's defeat: light arriving just in time, and a reason to wear something new.",
    },
    {
      name: "Lakshmi Puja",
      hindi: "लक्ष्मी पूजा",
      sub: "The new moon",
      text: "Rangoli at the threshold, lamps on every ledge, and a prayer that abundance finds its way inside. This is the night the whole festival is built around.",
      main: true,
    },
    {
      name: "Govardhan Puja",
      hindi: "गोवर्धन पूजा",
      sub: "Annakut",
      text: "A mountain of food is offered in gratitude for the harvest, then shared with everyone nearby — because a full table is meant to be opened.",
    },
    {
      name: "Bhai Dooj",
      hindi: "भाई दूज",
      sub: "The last day",
      text: "Sisters mark their brothers with a tilak, sweets are exchanged, and the five days close the way they began: with family at the door.",
    },
  ],
};

/** The countdown target, kept in step with the editable date above. */
export const diwaliDate = new Date(site.diwaliISO);


