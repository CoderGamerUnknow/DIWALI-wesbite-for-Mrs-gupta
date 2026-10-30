/**
 * Everything you may want to personalise lives here.
 * Add your school name and it will appear in the letter, hero and footer.
 */
export const site = {
  principal: "Respected Mrs. Gupta",
  principalShort: "Mrs. Gupta",
  from: "Your students",
  school: "", // e.g. "Sunrise Public School" — leave empty to hide

  diwaliISO: "2026-11-08T18:30:00+05:30",
  diwaliLabel: "8 November 2026",
  year: "2026",

  letter: {
    greeting: "Respected Mrs. Gupta,",
    paragraphs: [
      "On this festival of lights, we wanted to give you something that would not be folded away in a drawer. So we made you a little corner of the internet — every diya on it lit by your students.",
      "Every day, you light paths for us. You notice the quiet student, you make room for the second chance, and you keep the school's heart steady even on the days the timetable refuses to behave. That kind of light is easy to get used to — and far too rarely thanked.",
      "This Diwali, we hope some of that light comes home to you. May your house be full of laughter, your table full of sweets, and your year ahead full of the good news you have quietly earned.",
      "May Maa Lakshmi bless your doorstep, Maa Saraswati bless your words, and may the lamps you have lit in all of us never, ever go out.",
    ],
    closing: "With gratitude, respect and a little extra light,",
    signature: "Your students",
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
      text: "May the light you have sown in your students return to you doubled.",
    },
  ],
};

export const diwaliDate = new Date(site.diwaliISO);

export const withSchool = (text) =>
  site.school ? `${text} · ${site.school}` : text;
