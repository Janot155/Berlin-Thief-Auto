// Mission tuple: title, objective, trigger X/Z, destination X/Z, car required,
// time limit (seconds; 0 = relaxed), reward, legacy subtitle, required conversation id.
// Each objective is a reachable city landmark, so missions remain completable on foot.
export const MISSIONS = [
  ['Welcome to Berlin','Find Deniz at the station and talk to him.',2,0,6,0,0,0,150,'Deniz: Berlin traffic missed you. Parking signs did not.','deniz'],
  ['The garage','Visit Mila at her garage and hear what has changed.',6,0,-50,10,0,0,250,'Mila: The garage is standing. The gearbox is still negotiating.','mila'],
  ['Easy money','Take the delivery to the river district before the timer runs out.',-50,10,480,240,1,210,600,'Deniz: One small delivery. Almost suspiciously ordinary.'],
  ['Trouble at the kiosk','Reach the Späti and help Rafi with a staged safety drill.',480,240,90,24,0,0,450,'Rafi: Please tell me this is some kind of rehearsal.','clerk'],
  ['Brother’s call','Drive to the northern blocks and hear Jonas out.',90,24,480,10,0,0,650,'Jonas: I needed time. That is not the same as not caring.','jonas'],
  ['Night in the city','Meet the crew at Alexanderplatz for one evening off.',480,10,30,12,0,0,500,'Mila: No errands. No garage. No arguments with parking meters.'],
  ['The wrong address','Reach the canal exchange and leave with the evidence.',30,12,-600,-600,1,240,900,'Contact: You were told to meet me alone.'],
  ['Rain and consequences','Drive through the storm to the south shore rendezvous.',-600,-600,600,600,1,280,1100,'Mila: Rain, a warning light, and a car behind us. Normal.'],
  ['The missing witness','Meet Lena in the west gardens and compare the clues.',600,600,-240,-240,0,0,900,'Lena: Four places, four stories. Let’s find the facts.','lena'],
  ['The long ride','Pick up Deniz and make the long ride back across town.',-240,-240,6,0,0,0,750,'Deniz: I know every shortcut. Half of them are roads.','deniz'],
  ['The final deal','Reach Brandt’s riverfront district, then talk to him.',6,0,660,-590,0,0,1400,'Mila: We have the team, the evidence and a route.','viktor'],
  ['Everything changes','Meet Niko, repair the safe flat, and finish the story.',660,-590,-550,590,0,0,1800,'Niko: Welcome home. The ceiling leaks in exactly four places.','niko']
];
