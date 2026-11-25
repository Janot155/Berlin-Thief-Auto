// Original short-form camera/dialogue beats for all twelve missions.
// Camera offsets are relative to Alex, keeping each scene robust at any spawn point.
const beat = (speaker, line, camera, duration = 2.6, look = [0, 1.1, 0]) => ({ speaker, line, camera, duration, look });
const scene = (intro, outro) => ({ intro, outro });

export const CAMPAIGN_CUTSCENES = [
  scene([beat('DENIZ', 'Welcome back to Berlin. The traffic missed you. The parking signs did not.', [22, 12, 24]), beat('ALEX', 'I was hoping the city had learned to behave while I was gone.', [7, 4, 10]), beat('MILA', 'Find the garage. I have a car that only makes three worrying noises now.', [-8, 3, 9])], [beat('DENIZ', 'City tour complete. I charge extra for emotional support.', [12, 5, 15]), beat('ALEX', 'Put it on the meter.', [-6, 3, 8])]),
  scene([beat('MILA', 'You are back. The garage is still standing, which is more than I can say for this gearbox.', [15, 8, 17]), beat('ALEX', 'Nice place. Smells expensive.', [5, 3, 8]), beat('MILA', 'That is the sound of three overdue invoices.', [-7, 3, 8])], [beat('MILA', 'Take the blue hatchback. It is the least likely to become a conversation piece.', [9, 4, 12]), beat('ALEX', 'I will try to keep it in one piece.', [-7, 3, 7])]),
  scene([beat('DENIZ', 'One small delivery. Very ordinary. Almost suspiciously ordinary.', [18, 8, 20]), beat('ALEX', 'You say that before every interesting day.', [6, 3, 9]), beat('DENIZ', 'That is because my days are professionally interesting.', [-8, 4, 10])], [beat('RECIPIENT', 'You are Alex Novak? I knew your brother.', [7, 3, 8]), beat('ALEX', 'Then you know I have questions.', [-7, 3, 8])]),
  scene([beat('MILA', 'The kiosk owner needs a hand with a staged insurance drill. Keep it calm, keep it fictional.', [15, 8, 18]), beat('ALEX', 'A rehearsal with a silent alarm. What could possibly be awkward?', [6, 3, 9]), beat('CLERK', 'I have a sandwich delivery arriving in two minutes. Please be quick.', [-7, 3, 8])], [beat('CLERK', 'The alarm was a test. The paperwork is unfortunately real.', [6, 3, 8]), beat('ALEX', 'I will call you back after I find out who set this up.', [-9, 4, 10])]),
  scene([beat('JONAS', 'You came all this way just to ask where I have been?', [14, 7, 16]), beat('ALEX', 'I came because you stopped answering.', [5, 3, 8]), beat('JONAS', 'Then sit down. There is something you should know.', [-6, 3, 8])], [beat('JONAS', 'Brandt is buying up every useful contact in the district.', [6, 3, 8]), beat('ALEX', 'Then we find out what he is hiding.', [-8, 4, 10])]),
  scene([beat('MILA', 'One evening off. No garage, no errands, no arguing with parking meters.', [18, 9, 20]), beat('ALEX', 'I only argued because the meter started it.', [5, 3, 8]), beat('MILA', 'The meter has a better defense lawyer.', [-7, 3, 9])], [beat('MILA', 'That message was not a joke. We should go.', [12, 5, 14]), beat('ALEX', 'There goes my evening of not having an evening.', [-7, 3, 8])]),
  scene([beat('CONTACT', 'You were told to meet me alone.', [14, 8, 17]), beat('ALEX', 'I was told the address. You added the drama.', [5, 3, 9]), beat('CONTACT', 'Someone else is moving the pieces. Find the drop and leave.', [-8, 3, 9])], [beat('ALEX', 'Brandt is behind this.', [10, 5, 13]), beat('MILA', 'Then we stop guessing and start collecting proof.', [-7, 3, 8])]),
  scene([beat('MILA', 'Rain, a warning light, and a mysterious car behind us. Very normal evening.', [18, 8, 20]), beat('ALEX', 'At least the wipers work.', [5, 3, 8]), beat('MILA', 'That is the standard I want on my tombstone.', [-7, 3, 9])], [beat('MILA', 'We lost them. I am counting that as a win.', [12, 5, 14]), beat('ALEX', 'Let us keep the win and skip the encore.', [-8, 3, 9])]),
  scene([beat('LENA', 'Four places, four stories. One of them is going to tell the truth.', [18, 9, 20]), beat('ALEX', 'And if nobody does?', [5, 3, 9]), beat('LENA', 'Then we ask better questions.', [-7, 3, 8])], [beat('WITNESS', 'Brandt has a meeting tonight. The evidence is there.', [6, 3, 8]), beat('ALEX', 'That is enough to get us through the door.', [-8, 4, 10])]),
  scene([beat('DENIZ', 'Two passengers, one destination, and only one of them has read the map.', [18, 9, 20]), beat('PASSENGER', 'The map is upside down.', [5, 3, 9]), beat('DENIZ', 'It is a perspective exercise.', [-7, 3, 8])], [beat('DENIZ', 'I found you a meeting with Brandt. No fare this time.', [12, 5, 14]), beat('ALEX', 'I will pay you back.', [-8, 3, 9])]),
  scene([beat('MILA', 'We have the team, the evidence and a route that avoids the roadworks.', [18, 9, 20]), beat('JONAS', 'The roadworks move faster than our plan.', [5, 3, 9]), beat('DENIZ', 'I know a shortcut. It only adds twelve minutes.', [-7, 3, 8])], [beat('VIKTOR', 'You are all very persistent.', [12, 6, 15]), beat('ALEX', 'You are all very predictable.', [-8, 3, 9])]),
  scene([beat('VIKTOR', 'You could still walk away, Alex.', [16, 8, 18]), beat('ALEX', 'I tried that. The city kept calling.', [5, 3, 9]), beat('MILA', 'Your move. We are with you either way.', [-7, 3, 8])], [beat('ALEX', 'Tomorrow is ours to figure out.', [12, 8, 16]), beat('DENIZ', 'Good. I know a place that serves breakfast all night.', [-8, 3, 9])])
];

export const CAST = [
  { id: 'mila', name: 'Mila Weiss', role: 'Mechanic and Alex’s friend', shirt: 0xb44a36, pants: 0x252a32, x: -53, z: 6, h: Math.PI / 2, mission: 1 },
  { id: 'deniz', name: 'Deniz Kaya', role: 'Taxi driver', shirt: 0xd2a83c, pants: 0x252a32, x: 12, z: 12, h: 0, mission: 0 },
  { id: 'jonas', name: 'Jonas Novak', role: 'Alex’s brother', shirt: 0x365d75, pants: 0x24272a, x: 120, z: 12, h: Math.PI, mission: 4 },
  { id: 'viktor', name: 'Viktor Brandt', role: 'Businessman', shirt: 0x292d38, pants: 0x15171b, x: 120, z: -120, h: Math.PI / 2, mission: 10 },
  { id: 'lena', name: 'Lena Hartmann', role: 'Investigator', shirt: 0x536c4c, pants: 0x24272a, x: -30, z: -30, h: 0, mission: 8 },
  { id: 'clerk', name: 'Rafi Yilmaz', role: 'Späti shopkeeper', shirt: 0x3b7658, pants: 0x252a32, x: 90, z: 27, h: Math.PI, mission: 3 },
  { id: 'niko', name: 'Niko Petrov', role: 'Mechanic and flatmate', shirt: 0xc06c39, pants: 0x26272b, x: -140, z: 150, h: Math.PI / 2, mission: 11 }
];

export const NPC_LINES = {
  mila: ['The car is ready. The invoice is emotionally ready.', 'I tuned the engine. It now complains in a higher key.'],
  deniz: ['I know every shortcut. Half of them are roads.', 'Welcome aboard. Seatbelts are faster than my advice.'],
  jonas: ['I am trying to fix things. Starting with this door.', 'I should have called. I know that now.'],
  viktor: ['Berlin rewards people who understand timing.', 'You have a talent for turning up where I least expect you.'],
  lena: ['I am watching the facts, not the rumors.', 'If you find evidence, bring it to me.'],
  clerk: ['The safety drill is over. I am still counting the sandwiches.', 'Thanks for keeping that rehearsal calm. I owe you a coffee.'],
  niko: ['The flat is almost fixed. The ceiling and I have reached a truce.', 'A home is mostly good people and a toolbox that you can find.']
};
