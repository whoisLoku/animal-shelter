export type Language = 'EN' | 'TR';

export interface Animal {
  id: number;
  name: string;
  breed: string;
  age: string;
  type: 'dog' | 'cat';
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  image: string;
  description_en: string;
  description_tr: string;
  tags_en: string[];
  tags_tr: string[];
  adopted: boolean;
}

export interface TranslationStrings {
  nav: {
    home: string;
    about: string;
    pets: string;
    donate: string;
    adopt_btn: string;
    back_home: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_secondary: string;
    stat_1: string;
    stat_2: string;
  };
  about: {
    title: string;
    text: string;
    mission: string;
    mission_text: string;
    vision: string;
    vision_text: string;
  };
  filters: {
    all: string;
    dogs: string;
    cats: string;
    view_all_btn: string;
  };
  details: {
    age: string;
    gender: string;
    size: string;
    about: string;
    adopt_me: string;
    back: string;
    health: string;
    health_text: string;
  };
  donate: {
    title: string;
    subtitle: string;
    card1_title: string;
    card1_desc: string;
    card1_amount: string;
    card2_title: string;
    card2_desc: string;
    card2_amount: string;
    card3_title: string;
    card3_desc: string;
    card3_amount: string;
    btn: string;
    custom_amount: string;
  };
  forms: {
    adopt_title: string;
    adopt_subtitle: string;
    donate_title: string;
    name_label: string;
    email_label: string;
    phone_label: string;
    message_label: string;
    amount_label: string;
    card_label: string;
    submit_adopt: string;
    submit_donate: string;
    success_title: string;
    success_message_adopt: string;
    success_message_donate: string;
    close: string;
  };
  stats: {
    title: string;
    chart_label: string;
  };
  footer: {
    rights: string;
    contact: string;
  }
}
