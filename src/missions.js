// Mission tuple: title, objective, trigger X/Z, destination X/Z, car required,
// time limit (seconds; 0 = relaxed), reward, legacy subtitle, required conversation id.
// Each objective is a reachable city landmark, so missions remain completable on foot.
export const MISSIONS = [
  ['Welcome to Berlin','Find Deniz at the station and talk to him.',12,12,12,12,0,0,150,'Deniz: Berlin traffic missed you. Parking signs did not.','deniz'],
  ['The garage','Visit Mila at her garage and hear what has changed.',12,12,-53,6,0,0,250,'Mila: The garage is standing. The gearbox is still negotiating.','mila'],
  ['Easy money','Take the delivery across town before the timer runs out.',-45,20,-30,30,1,105,400,'Deniz: One small delivery. Almost suspiciously ordinary.'],
  ['Trouble at the kiosk','Reach the Späti and help Rafi with a staged safety drill.',-30,30,90,24,0,0,450,'Rafi: Please tell me this is some kind of rehearsal.','clerk'],
  ['Brother’s call','Go to Jonas’s neighborhood and hear him out.',90,24,120,8,0,0,500,'Jonas: I needed time. That is not the same as not caring.','jonas'],
  ['Night in the city','Meet the crew at Alexanderplatz for one evening off.',120,4,30,12,0,0,500,'Mila: No errands. No garage. No arguments with parking meters.'],
  ['The wrong address','Follow the lead to the canal yard and get out safely.',30,12,-90,-90,1,170,700,'Contact: You were told to meet me alone.'],
  ['Rain and consequences','Drive through the storm to the rendezvous.',-90,-90,90,90,1,160,800,'Mila: Rain, a warning light, and a car behind us. Normal.'],
  ['The missing witness','Meet Lena and compare the clues.',90,90,-30,-30,0,0,650,'Lena: Four places, four stories. Let’s find the facts.','lena'],
  ['The long ride','Pick up Deniz and make it back across town.',-30,-30,12,12,1,180,750,'Deniz: I know every shortcut. Half of them are roads.','deniz'],
  ['The final deal','Reach Brandt’s district, then talk to him.',12,12,120,-120,1,190,1000,'Mila: We have the team, the evidence and a route.','viktor'],
  ['Everything changes','Reach the safe flat, finish the repairs and speak with Niko.',120,-120,-140,150,0,0,1500,'Niko: Welcome home. The ceiling leaks in exactly four places.','niko']
];
