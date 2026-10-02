/* Cambridge IELTS 13 — transcribed from "IELTS Cambridge 13- pdf.pdf"
   Gap syntax inside html: [[n]] = text box for question n.
   Answers: alternatives separated by "|"; "(s)" style optional parts are expanded by the app. */
IELTS.addBook({
  id: 13,
  title: "Cambridge IELTS 13",
  audioDir: "Cambridge IELTS 13/IELTS Cambridge 13/",
  tests: [
    {
      n: 1,
      listening: {
        parts: [
          {
            title: "Cookery Classes",
            audio: "IELTS13-Tests1-4CD1Track_01.mp3",
            groups: [
              {
                instr: "Complete the table below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">COOKERY CLASSES</h4>
<table class="grid">
<tr><th>Cookery Class</th><th>Focus</th><th>Other Information</th></tr>
<tr><td><i>Example</i><br>The Food <u>Studio</u></td>
<td>how to [[1]] and cook with seasonal products</td>
<td><ul><li>small classes</li><li>also offers [[2]] classes</li><li>clients who return get a [[3]] discount</li></ul></td></tr>
<tr><td>Bond's Cookery School</td><td>food that is [[4]]</td>
<td><ul><li>includes recipes to strengthen your [[5]]</li><li>they have a free [[6]] every Thursday</li></ul></td></tr>
<tr><td>The [[7]] Centre</td><td>mainly [[8]] food</td>
<td><ul><li>located near the [[9]]</li><li>a special course in skills with a [[10]] is sometimes available</li></ul></td></tr>
</table>`
              }
            ]
          },
          {
            title: "Traffic Changes in Granford",
            audio: "IELTS13-Tests1-4CD1Track_02.mp3",
            groups: [
              {
                instr: "Questions 11–13<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Traffic Changes in Granford",
                items: [
                  { q: 11, text: "Why are changes needed to traffic systems in Granford?", options: ["The number of traffic accidents has risen.", "The amount of traffic on the roads has increased.", "The types of vehicles on the roads have changed."] },
                  { q: 12, text: "In a survey, local residents particularly complained about", options: ["dangerous driving by parents.", "pollution from trucks and lorries.", "inconvenience from parked cars."] },
                  { q: 13, text: "According to the speaker, one problem with the new regulations will be", options: ["raising money to pay for them.", "finding a way to make people follow them.", "getting the support of the police."] }
                ]
              },
              {
                instr: "Questions 14–20<br>Label the map below.<br>Write the correct letter, <b>A–I</b>, next to Questions 14–20.",
                type: "match",
                image: "assets/c13/t1-l-map.png",
                letters: "ABCDEFGHI",
                items: [
                  { q: 14, text: "New traffic lights" },
                  { q: 15, text: "Pedestrian crossing" },
                  { q: 16, text: "Parking allowed" },
                  { q: 17, text: "New 'No Parking' sign" },
                  { q: 18, text: "New disabled parking spaces" },
                  { q: 19, text: "Widened pavement" },
                  { q: 20, text: "Lorry loading/unloading restrictions" }
                ]
              }
            ]
          },
          {
            title: "Seed Germination Experiment",
            audio: "IELTS13-Tests1-4CD1Track_03.mp3",
            groups: [
              {
                instr: "Questions 21–25<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                items: [
                  { q: 21, text: "Why is Jack interested in investigating seed germination?", options: ["He may do a module on a related topic later on.", "He wants to have a career in plant science.", "He is thinking of choosing this topic for his dissertation."] },
                  { q: 22, text: "Jack and Emma agree the main advantage of their present experiment is that it can be", options: ["described very easily.", "carried out inside the laboratory.", "completed in the time available."] },
                  { q: 23, text: "What do they decide to check with their tutor?", options: ["whether their aim is appropriate", "whether anyone else has chosen this topic", "whether the assignment contributes to their final grade"] },
                  { q: 24, text: "They agree that Graves' book on seed germination is disappointing because", options: ["it fails to cover recent advances in seed science.", "the content is irrelevant for them.", "its focus is very theoretical."] },
                  { q: 25, text: "What does Jack say about the article on seed germination by Lee Hall?", options: ["The diagrams of plant development are useful.", "The analysis of seed germination statistics is thorough.", "The findings on seed germination after fires are surprising."] }
                ]
              },
              {
                instr: "Questions 26–30<br>Complete the flow-chart below.<br>Choose <b>FIVE</b> answers from the box and write the correct letter, <b>A–H</b>, next to Questions 26–30.",
                type: "html",
                box: [["A", "container"], ["B", "soil"], ["C", "weight"], ["D", "condition"], ["E", "height"], ["F", "colour"], ["G", "types"], ["H", "depths"]],
                letters: "ABCDEFGH",
                html: `
<h4 class="center">Stages in the experiment</h4>
<div class="flow">
<div>Select seeds of different [[26]] and sizes.</div>
<div>Measure and record the [[27]] and size of each one.</div>
<div>Decide on the [[28]] to be used.</div>
<div>Use a different [[29]] for each seed and label it.</div>
<div>After about 3 weeks, record the plant's [[30]].</div>
<div>Investigate the findings.</div>
</div>`
              }
            ]
          },
          {
            title: "Effects of urban environments on animals",
            audio: "IELTS13-Tests1-4CD1Track_04.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Effects of urban environments on animals</h4>
<p><b>Introduction</b></p>
<p>Recent urban developments represent massive environmental changes. It was previously thought that only a few animals were suitable for city life, e.g.</p>
<ul>
<li>the [[31]] – because of its general adaptability</li>
<li>the pigeon – because walls of city buildings are similar to [[32]]</li>
</ul>
<p>In fact, many urban animals are adapting with unusual [[33]].</p>
<p><b>Recent research</b></p>
<ul>
<li>Emilie Snell-Rood studied small urbanised mammal specimens from museums in Minnesota.
  <ul><li>She found the size of their [[34]] had increased.</li>
  <li>She suggests this may be due to the need to locate new sources of [[35]] and to deal with new dangers.</li></ul></li>
<li>Catarina Miranda focused on the [[36]] of urban and rural blackbirds.
  <ul><li>She found urban birds were often braver, but were afraid of situations that were [[37]].</li></ul></li>
<li>Jonathan Atwell studies how animals respond to urban environments.
  <ul><li>He found that some animals respond to [[38]] by producing lower levels of hormones.</li></ul></li>
<li>Sarah Partan's team found urban squirrels use their [[39]] to help them communicate.</li>
</ul>
<p><b>Long-term possibilities</b></p>
<p>Species of animals may develop which are unique to cities. However, some changes may not be [[40]].</p>`
              }
            ]
          }
        ],
        answers: {
          1: "choose", 2: "private", 3: "20|twenty|20%|20 percent|twenty percent|20 per cent|twenty per cent", 4: "healthy", 5: "bones",
          6: "lecture", 7: "Arretsa", 8: "vegetarian", 9: "market", 10: "knife",
          11: "B", 12: "C", 13: "B", 14: "E", 15: "D", 16: "B", 17: "G", 18: "C", 19: "H", 20: "I",
          21: "A", 22: "C", 23: "B", 24: "C", 25: "B", 26: "G", 27: "C", 28: "H", 29: "A", 30: "E",
          31: "crow", 32: "cliffs", 33: "speed", 34: "brain(s)", 35: "food", 36: "behaviour(s)|behavior(s)",
          37: "new", 38: "stress", 39: "tail(s)", 40: "permanent"
        }
      },

      reading: {
        passages: [
          {
            title: "Case Study: Tourism New Zealand website",
            text: `
<h3>Case Study: <i>Tourism New Zealand</i> website</h3>
<p>New Zealand is a small country of four million inhabitants, a long-haul flight from all the major tourist-generating markets of the world. Tourism currently makes up 9% of the country's gross domestic product, and is the country's largest export sector. Unlike other export sectors, which make products and then sell them overseas, tourism brings its customers to New Zealand. The product is the country itself – the people, the places and the experiences. In 1999, Tourism New Zealand launched a campaign to communicate a new brand position to the world. The campaign focused on New Zealand's scenic beauty, exhilarating outdoor activities and authentic Maori culture, and it made New Zealand one of the strongest national brands in the world.</p>
<p>A key feature of the campaign was the website www.newzealand.com, which provided potential visitors to New Zealand with a single gateway to everything the destination had to offer. The heart of the website was a database of tourism services operators, both those based in New Zealand and those based abroad which offered tourism services to the country. Any tourism-related business could be listed by filling in a simple form. This meant that even the smallest bed and breakfast address or specialist activity provider could gain a web presence with access to an audience of long-haul visitors. In addition, because participating businesses were able to update the details they gave on a regular basis, the information provided remained accurate. And to maintain and improve standards, Tourism New Zealand organised a scheme whereby organisations appearing on the website underwent an independent evaluation against a set of agreed national standards of quality. As part of this, the effect of each business on the environment was considered.</p>
<p>To communicate the New Zealand experience, the site also carried features relating to famous people and places. One of the most popular was an interview with former New Zealand All Blacks rugby captain Tana Umaga. Another feature that attracted a lot of attention was an interactive journey through a number of the locations chosen for blockbuster films which had made use of New Zealand's stunning scenery as a backdrop. As the site developed, additional features were added to help independent travellers devise their own customised itineraries. To make it easier to plan motoring holidays, the site catalogued the most popular driving routes in the country, highlighting different routes according to the season and indicating distances and times.</p>
<p>Later, a Travel Planner feature was added, which allowed visitors to click and 'bookmark' places or attractions they were interested in, and then view the results on a map. The Travel Planner offered suggested routes and public transport options between the chosen locations. There were also links to accommodation in the area. By registering with the website, users could save their Travel Plan and return to it later, or print it out to take on the visit. The website also had a 'Your Words' section where anyone could submit a blog of their New Zealand travels for possible inclusion on the website.</p>
<p>The Tourism New Zealand website won two Webby awards for online achievement and innovation. More importantly perhaps, the growth of tourism to New Zealand was impressive. Overall tourism expenditure increased by an average of 6.9% per year between 1999 and 2004. From Britain, visits to New Zealand grew at an average annual rate of 13% between 2002 and 2006, compared to a rate of 4% overall for British visits abroad.</p>
<p>The website was set up to allow both individuals and travel organisations to create itineraries and travel packages to suit their own needs and interests. On the website, visitors can search for activities not solely by geographical location, but also by the particular nature of the activity. This is important as research shows that activities are the key driver of visitor satisfaction, contributing 74% to visitor satisfaction, while transport and accommodation account for the remaining 26%. The more activities that visitors undertake, the more satisfied they will be. It has also been found that visitors enjoy cultural activities most when they are interactive, such as visiting a <i>marae</i> (meeting ground) to learn about traditional Maori life. Many long-haul travellers enjoy such learning experiences, which provide them with stories to take home to their friends and family. In addition, it appears that visitors to New Zealand don't want to be 'one of the crowd' and find activities that involve only a few people more special and meaningful.</p>
<p>It could be argued that New Zealand is not a typical destination. New Zealand is a small country with a visitor economy composed mainly of small businesses. It is generally perceived as a safe English-speaking country with a reliable transport infrastructure. Because of the long-haul flight, most visitors stay for longer (average 20 days) and want to see as much of the country as possible on what is often seen as a once-in-a-lifetime visit. However, the underlying lessons apply anywhere – the effectiveness of a strong brand, a strategy based on unique experiences and a comprehensive and user-friendly website.</p>`,
            groups: [
              {
                instr: "Questions 1–7<br>Complete the table below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<table class="grid">
<tr><th>Section of website</th><th>Comments</th></tr>
<tr><td>Database of tourism services</td><td><ul><li>easy for tourism-related businesses to get on the list</li><li>allowed businesses to [[1]] information regularly</li><li>provided a country-wide evaluation of businesses, including their impact on the [[2]]</li></ul></td></tr>
<tr><td>Special features on local topics</td><td><ul><li>e.g. an interview with a former sports [[3]], and an interactive tour of various locations used in [[4]]</li></ul></td></tr>
<tr><td>Information on driving routes</td><td><ul><li>varied depending on the [[5]]</li></ul></td></tr>
<tr><td>Travel Planner</td><td><ul><li>included a map showing selected places, details of public transport and local [[6]]</li></ul></td></tr>
<tr><td>'Your Words'</td><td><ul><li>travellers could send a link to their [[7]]</li></ul></td></tr>
</table>`
              },
              {
                instr: "Questions 8–13<br>Do the following statements agree with the information given in Reading Passage 1?<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
                type: "choice",
                choices: ["TRUE", "FALSE", "NOT GIVEN"],
                items: [
                  { q: 8, text: "The website www.newzealand.com aimed to provide ready-made itineraries and packages for travel companies and individual tourists." },
                  { q: 9, text: "It was found that most visitors started searching on the website by geographical location." },
                  { q: 10, text: "According to research, 26% of visitor satisfaction is related to their accommodation." },
                  { q: 11, text: "Visitors to New Zealand like to become involved in the local culture." },
                  { q: 12, text: "Visitors like staying in small hotels in New Zealand rather than in larger ones." },
                  { q: 13, text: "Many visitors feel it is unlikely that they will return to New Zealand after their visit." }
                ]
              }
            ]
          },
          {
            title: "Why being bored is stimulating – and useful, too",
            text: `
<h3>Why being bored is stimulating – and useful, too</h3>
<p class="sub"><i>This most common of emotions is turning out to be more interesting than we thought</i></p>
<p><b>A</b> We all know how it feels – it's impossible to keep your mind on anything, time stretches out, and all the things you could do seem equally unlikely to make you feel better. But defining boredom so that it can be studied in the lab has proved difficult. For a start, it can include a lot of other mental states, such as frustration, apathy, depression and indifference. There isn't even agreement over whether boredom is always a low-energy, flat kind of emotion or whether feeling agitated and restless counts as boredom, too. In his book, <i>Boredom: A Lively History</i>, Peter Toohey at the University of Calgary, Canada, compares it to disgust – an emotion that motivates us to stay away from certain situations. 'If disgust protects humans from infection, boredom may protect them from "infectious" social situations,' he suggests.</p>
<p><b>B</b> By asking people about their experiences of boredom, Thomas Goetz and his team at the University of Konstanz in Germany have recently identified five distinct types: indifferent, calibrating, searching, reactant and apathetic. These can be plotted on two axes – one running left to right, which measures low to high arousal, and the other from top to bottom, which measures how positive or negative the feeling is. Intriguingly, Goetz has found that while people experience all kinds of boredom, they tend to specialise in one. Of the five types, the most damaging is 'reactant' boredom with its explosive combination of high arousal and negative emotion. The most useful is what Goetz calls 'indifferent' boredom: someone isn't engaged in anything satisfying but still feels relaxed and calm. However, it remains to be seen whether there are any character traits that predict the kind of boredom each of us might be prone to.</p>
<p><b>C</b> Psychologist Sandi Mann at the University of Central Lancashire, UK, goes further. 'All emotions are there for a reason, including boredom,' she says. Mann has found that being bored makes us more creative. 'We're all afraid of being bored but in actual fact it can lead to all kinds of amazing things,' she says. In experiments published last year, Mann found that people who had been made to feel bored by copying numbers out of the phone book for 15 minutes came up with more creative ideas about how to use a polystyrene cup than a control group. Mann concluded that a passive, boring activity is best for creativity because it allows the mind to wander. In fact, she goes so far as to suggest that we should seek out more boredom in our lives.</p>
<p><b>D</b> Psychologist John Eastwood at York University in Toronto, Canada, isn't convinced. 'If you are in a state of mind-wandering you are not bored,' he says. 'In my view, by definition boredom is an undesirable state.' That doesn't necessarily mean that it isn't adaptive, he adds. 'Pain is adaptive – if we didn't have physical pain, bad things would happen to us. Does that mean that we should actively cause pain? No. But even if boredom has evolved to help us survive, it can still be toxic if allowed to fester.' For Eastwood, the central feature of boredom is a failure to put our 'attention system' into gear. This causes an inability to focus on anything, which makes time seem to go painfully slowly. What's more, your efforts to improve the situation can end up making you feel worse. 'People try to connect with the world and if they are not successful there's that frustration and irritability,' he says. Perhaps most worryingly, says Eastwood, repeatedly failing to engage attention can lead to a state where we don't know what to do any more, and no longer care.</p>
<p><b>E</b> Eastwood's team is now trying to explore why the attention system fails. It's early days but they think that at least some of it comes down to personality. Boredom proneness has been linked with a variety of traits. People who are motivated by pleasure seem to suffer particularly badly. Other personality traits, such as curiosity, are associated with a high boredom threshold. More evidence that boredom has detrimental effects comes from studies of people who are more or less prone to boredom. It seems those who bore easily face poorer prospects in education, their career and even life in general. But of course, boredom itself cannot kill – it's the things we do to deal with it that may put us in danger. What can we do to alleviate it before it comes to that? Goetz's group has one suggestion. Working with teenagers, they found that those who 'approach' a boring situation – in other words, see that it's boring and get stuck in anyway – report less boredom than those who try to avoid it by using snacks, TV or social media for distraction.</p>
<p><b>F</b> Psychologist Francoise Wemelsfelder speculates that our over-connected lifestyles might even be a new source of boredom. 'In modern human society there is a lot of overstimulation but still a lot of problems finding meaning,' she says. So instead of seeking yet more mental stimulation, perhaps we should leave our phones alone, and use boredom to motivate us to engage with the world in a more meaningful way.</p>`,
            groups: [
              {
                instr: "Questions 14–19<br>Reading Passage 2 has six paragraphs, <b>A–F</b>.<br>Choose the correct heading for each paragraph from the list of headings below.",
                type: "match",
                boxTitle: "List of Headings",
                box: [["i", "The productive outcomes that may result from boredom"], ["ii", "What teachers can do to prevent boredom"], ["iii", "A new explanation and a new cure for boredom"], ["iv", "Problems with a scientific approach to boredom"], ["v", "A potential danger arising from boredom"], ["vi", "Creating a system of classification for feelings of boredom"], ["vii", "Age groups most affected by boredom"], ["viii", "Identifying those most affected by boredom"]],
                items: [
                  { q: 14, text: "Paragraph A" }, { q: 15, text: "Paragraph B" }, { q: 16, text: "Paragraph C" },
                  { q: 17, text: "Paragraph D" }, { q: 18, text: "Paragraph E" }, { q: 19, text: "Paragraph F" }
                ]
              },
              {
                instr: "Questions 20–23<br>Look at the following people (Questions 20–23) and the list of ideas below.<br>Match each person with the correct idea, <b>A–E</b>.",
                type: "match",
                boxTitle: "List of Ideas",
                box: [["A", "The way we live today may encourage boredom."], ["B", "One sort of boredom is worse than all the others."], ["C", "Levels of boredom may fall in the future."], ["D", "Trying to cope with boredom can increase its negative effects."], ["E", "Boredom may encourage us to avoid an unpleasant experience."]],
                items: [
                  { q: 20, text: "Peter Toohey" }, { q: 21, text: "Thomas Goetz" },
                  { q: 22, text: "John Eastwood" }, { q: 23, text: "Francoise Wemelsfelder" }
                ]
              },
              {
                instr: "Questions 24–26<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">Responses to boredom</h4>
<p>For John Eastwood, the central feature of boredom is that people cannot [[24]], due to a failure in what he calls the 'attention system', and as a result they become frustrated and irritable. His team suggests that those for whom [[25]] is an important aim in life may have problems in coping with boredom, whereas those who have the characteristic of [[26]] can generally cope with it.</p>`
              }
            ]
          },
          {
            title: "Artificial artists",
            text: `
<h3>Artificial artists</h3>
<p class="sub"><i>Can computers really create works of art?</i></p>
<p>The Painting Fool is one of a growing number of computer programs which, so their makers claim, possess creative talents. Classical music by an artificial composer has had audiences enraptured, and even tricked them into believing a human was behind the score. Artworks painted by a robot have sold for thousands of dollars and been hung in prestigious galleries. And software has been built which creates art that could not have been imagined by the programmer.</p>
<p>Human beings are the only species to perform sophisticated creative acts regularly. If we can break this process down into computer code, where does that leave human creativity? 'This is a question at the very core of humanity,' says Geraint Wiggins, a computational creativity researcher at Goldsmiths, University of London. 'It scares a lot of people. They are worried that it is taking something special away from what it means to be human.'</p>
<p>To some extent, we are all familiar with computerised art. The question is: where does the work of the artist stop and the creativity of the computer begin? Consider one of the oldest machine artists, Aaron, a robot that has had paintings exhibited in London's Tate Modern and the San Francisco Museum of Modern Art. Aaron can pick up a paintbrush and paint on canvas on its own. Impressive perhaps, but it is still little more than a tool to realise the programmer's own creative ideas.</p>
<p>Simon Colton, the designer of the Painting Fool, is keen to make sure his creation doesn't attract the same criticism. Unlike earlier 'artists' such as Aaron, the Painting Fool only needs minimal direction and can come up with its own concepts by going online for material. The software runs its own web searches and trawls through social media sites. It is now beginning to display a kind of imagination too, creating pictures from scratch. One of its original works is a series of fuzzy landscapes, depicting trees and sky. While some might say they have a mechanical look, Colton argues that such reactions arise from people's double standards towards software-produced and human-produced art. After all, he says, consider that the Painting Fool painted the landscapes without referring to a photo. 'If a child painted a new scene from his head, you'd say it has a certain level of imagination,' he points out. 'The same should be true of a machine.' Software bugs can also lead to unexpected results. Some of the Painting Fool's paintings of a chair came out in black and white, thanks to a technical glitch. This gives the work an eerie, ghostlike quality. Human artists like the renowned Ellsworth Kelly are lauded for limiting their colour palette – so why should computers be any different?</p>
<p>Researchers like Colton don't believe it is right to measure machine creativity directly to that of humans who 'have had millennia to develop our skills'. Others, though, are fascinated by the prospect that a computer might create something as original and subtle as our best artists. So far, only one has come close. Composer David Cope invented a program called Experiments in Musical Intelligence, or EMI. Not only did EMI create compositions in Cope's style, but also that of the most revered classical composers, including Bach, Chopin and Mozart. Audiences were moved to tears, and EMI even fooled classical music experts into thinking they were hearing genuine Bach. Not everyone was impressed however. Some, such as Wiggins, have blasted Cope's work as pseudoscience, and condemned him for his deliberately vague explanation of how the software worked. Meanwhile, Douglas Hofstadter of Indiana University said EMI created replicas which still rely completely on the original artist's creative impulses. When audiences found out the truth they were often outraged with Cope, and one music lover even tried to punch him. Amid such controversy, Cope destroyed EMI's vital databases.</p>
<p>But why did so many people love the music, yet recoil when they discovered how it was composed? A study by computer scientist David Moffat of Glasgow Caledonian University provides a clue. He asked both expert musicians and non-experts to assess six compositions. The participants weren't told beforehand whether the tunes were composed by humans or computers, but were asked to guess, and then rate how much they liked each one. People who thought the composer was a computer tended to dislike the piece more than those who believed it was human. This was true even among the experts, who might have been expected to be more objective in their analyses.</p>
<p>Where does this prejudice come from? Paul Bloom of Yale University has a suggestion: he reckons part of the pleasure we get from art stems from the creative process behind the work. This can give it an 'irresistible essence', says Bloom. Meanwhile, experiments by Justin Kruger of New York University have shown that people's enjoyment of an artwork increases if they think more time and effort was needed to create it. Similarly, Colton thinks that when people experience art, they wonder what the artist might have been thinking or what the artist is trying to tell them. It seems obvious, therefore, that with computers producing art, this speculation is cut short – there's nothing to explore. But as technology becomes increasingly complex, finding those greater depths in computer art could become possible. This is precisely why Colton asks the Painting Fool to tap into online social networks for its inspiration: hopefully this way it will choose themes that will already be meaningful to us.</p>`,
            groups: [
              {
                instr: "Questions 27–31<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.",
                type: "mcq",
                items: [
                  { q: 27, text: "What is the writer suggesting about computer-produced works in the first paragraph?", options: ["People's acceptance of them can vary considerably.", "A great deal of progress has already been attained in this field.", "They have had more success in some artistic genres than in others.", "The advances are not as significant as the public believes them to be."] },
                  { q: 28, text: "According to Geraint Wiggins, why are many people worried by computer art?", options: ["It is aesthetically inferior to human art.", "It may ultimately supersede human art.", "It undermines a fundamental human quality.", "It will lead to a deterioration in human ability."] },
                  { q: 29, text: "What is a key difference between Aaron and the Painting Fool?", options: ["its programmer's background", "public response to its work", "the source of its subject matter", "the technical standard of its output"] },
                  { q: 30, text: "What point does Simon Colton make in the fourth paragraph?", options: ["Software-produced art is often dismissed as childish and simplistic.", "The same concepts of creativity should not be applied to all forms of art.", "It is unreasonable to expect a machine to be as imaginative as a human being.", "People tend to judge computer art and human art according to different criteria."] },
                  { q: 31, text: "The writer refers to the paintings of a chair as an example of computer art which", options: ["achieves a particularly striking effect.", "exhibits a certain level of genuine artistic skill.", "closely resembles that of a well-known artist.", "highlights the technical limitations of the software."] }
                ]
              },
              {
                instr: "Questions 32–37<br>Complete each sentence with the correct ending, <b>A–G</b>, below.",
                type: "match",
                boxTitle: "",
                box: [["A", "generating work that was virtually indistinguishable from that of humans."], ["B", "knowing whether it was the work of humans or software."], ["C", "producing work entirely dependent on the imagination of its creator."], ["D", "comparing the artistic achievements of humans and computers."], ["E", "revealing the technical details of his program."], ["F", "persuading the public to appreciate computer art."], ["G", "discovering that it was the product of a computer program."]],
                items: [
                  { q: 32, text: "Simon Colton says it is important to consider the long-term view when" },
                  { q: 33, text: "David Cope's EMI software surprised people by" },
                  { q: 34, text: "Geraint Wiggins criticised Cope for not" },
                  { q: 35, text: "Douglas Hofstadter claimed that EMI was" },
                  { q: 36, text: "Audiences who had listened to EMI's music became angry after" },
                  { q: 37, text: "The participants in David Moffat's study had to assess music without" }
                ]
              },
              {
                instr: "Questions 38–40<br>Do the following statements agree with the claims of the writer in Reading Passage 3?<br><b>YES</b> if the statement agrees with the claims of the writer<br><b>NO</b> if the statement contradicts the claims of the writer<br><b>NOT GIVEN</b> if it is impossible to say what the writer thinks about this",
                type: "choice",
                choices: ["YES", "NO", "NOT GIVEN"],
                items: [
                  { q: 38, text: "Moffat's research may help explain people's reactions to EMI." },
                  { q: 39, text: "The non-experts in Moffat's study all responded in a predictable way." },
                  { q: 40, text: "Justin Kruger's findings cast doubt on Paul Bloom's theory about people's prejudice towards computer art." }
                ]
              }
            ]
          }
        ],
        answers: {
          1: "update", 2: "environment", 3: "captain", 4: "films", 5: "season", 6: "accommodation", 7: "blog",
          8: "FALSE", 9: "NOT GIVEN", 10: "FALSE", 11: "TRUE", 12: "NOT GIVEN", 13: "TRUE",
          14: "iv", 15: "vi", 16: "i", 17: "v", 18: "viii", 19: "iii",
          20: "E", 21: "B", 22: "D", 23: "A", 24: "focus", 25: "pleasure", 26: "curiosity",
          27: "B", 28: "C", 29: "C", 30: "D", 31: "A", 32: "D", 33: "A", 34: "E", 35: "C", 36: "G", 37: "B",
          38: "YES", 39: "NOT GIVEN", 40: "NO"
        }
      },

      writing: [
        {
          task: 1, minutes: 20, words: 150,
          prompt: "<p><b><i>The two maps below show road access to a city hospital in 2007 and in 2010.</i></b></p><p><b><i>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</i></b></p>",
          image: "assets/c13/t1-w1.png"
        },
        {
          task: 2, minutes: 40, words: 250,
          prompt: "<p><b><i>Living in a country where you have to speak a foreign language can cause serious social problems, as well as practical problems.</i></b></p><p><b><i>To what extent do you agree or disagree with this statement?</i></b></p><p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>"
        }
      ],

      speaking: `
<h4>Part 1</h4>
<p>The examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.</p>
<p><b>Television programmes</b></p>
<ul>
<li>Where do you usually watch TV programmes/shows? [Why?/Why not?]</li>
<li>What's your favourite TV programme/show? [Why?]</li>
<li>Are there any programmes/shows you don't like watching? [Why?/Why not?]</li>
<li>Do you think you will watch more TV or fewer TV programmes/shows in the future? [Why?/Why not?]</li>
</ul>
<h4>Part 2</h4>
<div class="cue"><b>Describe someone you know who has started a business.</b><br><br>You should say:<br>&nbsp;&nbsp;who this person is<br>&nbsp;&nbsp;what work this person does<br>&nbsp;&nbsp;why this person decided to start a business<br>and explain whether you would like to do the same kind of work as this person.</div>
<p class="muted">You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say.</p>
<h4>Part 3</h4>
<p><b>Choosing work</b></p>
<ul>
<li>What kinds of jobs do young people <u>not</u> want to do in your country?</li>
<li>Who is best at advising young people about choosing a job: teachers or parents?</li>
<li>Is money always the most important thing when choosing a job?</li>
</ul>
<p><b>Work–Life balance</b></p>
<ul>
<li>Do you agree that many people nowadays are under pressure to work longer hours and take less holiday?</li>
<li>What is the impact on society of people having a poor work–life balance?</li>
<li>Could you recommend some effective strategies for governments and employers to ensure people have a good work–life balance?</li>
</ul>`
    },

    // ================= TEST 2 =================
    {
      n: 2,
      listening: {
        parts: [
          {
            title: "South City Cycling Club",
            audio: "IELTS13-Tests1-4CD1Track_05.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">South City Cycling Club</h4>
<p><i>Example</i><br>Name of club secretary: Jim <u>Hunter</u></p>
<p><b>Membership</b></p>
<ul>
<li>Full membership costs $260; this covers cycling and [[1]] all over Australia</li>
<li>Recreational membership costs $108</li>
<li>Cost of membership includes the club fee and [[2]]</li>
<li>The club kit is made by a company called [[3]]</li>
</ul>
<p><b>Training rides</b></p>
<ul>
<li>Chance to improve cycling skills and fitness</li>
<li>Level B: speed about [[4]] kph</li>
<li>Weekly sessions
  <ul><li>Tuesdays at 5.30 am, meet at the [[5]]</li>
  <li>Thursdays at 5.30 am, meet at the entrance to the [[6]]</li></ul></li>
</ul>
<p><b>Further information</b></p>
<ul>
<li>Rides are about an hour and a half</li>
<li>Members often have [[7]] together afterwards</li>
<li>There is not always a [[8]] with the group on these rides</li>
<li>Check and print the [[9]] on the website beforehand</li>
<li>Bikes must have [[10]]</li>
</ul>`
              }
            ]
          },
          {
            title: "Information on company volunteering projects",
            audio: "IELTS13-Tests1-4CD1Track_06.mp3",
            groups: [
              {
                instr: "Questions 11–16<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Information on company volunteering projects",
                items: [
                  { q: 11, text: "How much time for volunteering does the company allow per employee?", options: ["two hours per week", "one day per month", "8 hours per year"] },
                  { q: 12, text: "In feedback almost all employees said that volunteering improved their", options: ["chances of promotion.", "job satisfaction.", "relationships with colleagues."] },
                  { q: 13, text: "Last year some staff helped unemployed people with their", options: ["literacy skills.", "job applications.", "communication skills."] },
                  { q: 14, text: "This year the company will start a new volunteering project with a local", options: ["school.", "park.", "charity."] },
                  { q: 15, text: "Where will the Digital Inclusion Day be held?", options: ["at the company's training facility", "at a college", "in a community centre"] },
                  { q: 16, text: "What should staff do if they want to take part in the Digital Inclusion Day?", options: ["fill in a form", "attend a training workshop", "get permission from their manager"] }
                ]
              },
              {
                instr: "Questions 17 and 18<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [17, 18],
                text: "What <b>TWO</b> things are mentioned about the participants on the last Digital Inclusion Day?",
                options: ["They were all over 70.", "They never used their computer.", "Their phones were mostly old-fashioned.", "They only used their phones for making calls.", "They initially showed little interest."]
              },
              {
                instr: "Questions 19 and 20<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [19, 20],
                text: "What <b>TWO</b> activities on the last Digital Inclusion Day did participants describe as useful?",
                options: ["learning to use tablets", "communicating with family", "shopping online", "playing online games", "sending emails"]
              }
            ]
          },
          {
            title: "Planning a presentation on nanotechnology",
            audio: "IELTS13-Tests1-4CD1Track_07.mp3",
            groups: [
              {
                instr: "Questions 21–25<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Planning a presentation on nanotechnology",
                items: [
                  { q: 21, text: "Russ says that his difficulty in planning the presentation is due to", options: ["his lack of knowledge about the topic.", "his uncertainty about what he should try to achieve.", "the short time that he has for preparation."] },
                  { q: 22, text: "Russ and his tutor agree that his approach in the presentation will be", options: ["to concentrate on how nanotechnology is used in one field.", "to follow the chronological development of nanotechnology.", "to show the range of applications of nanotechnology."] },
                  { q: 23, text: "In connection with slides, the tutor advises Russ to", options: ["talk about things that he can find slides to illustrate.", "look for slides to illustrate the points he makes.", "consider omitting slides altogether."] },
                  { q: 24, text: "They both agree that the best way for Russ to start his presentation is", options: ["to encourage the audience to talk.", "to explain what Russ intends to do.", "to provide an example."] },
                  { q: 25, text: "What does the tutor advise Russ to do next while preparing his presentation?", options: ["summarise the main point he wants to make", "read the notes he has already made", "list the topics he wants to cover"] }
                ]
              },
              {
                instr: "Questions 26–30<br>What comments do the speakers make about each of the following aspects of Russ's previous presentation?<br>Choose <b>FIVE</b> answers from the box and write the correct letter, <b>A–G</b>, next to Questions 26–30.",
                type: "match",
                boxTitle: "Comments",
                box: [["A", "lacked a conclusion"], ["B", "useful in the future"], ["C", "not enough"], ["D", "sometimes distracting"], ["E", "showed originality"], ["F", "covered a wide range"], ["G", "not too technical"]],
                items: [
                  { q: 26, text: "structure" }, { q: 27, text: "eye contact" }, { q: 28, text: "body language" },
                  { q: 29, text: "choice of words" }, { q: 30, text: "handouts" }
                ]
              }
            ]
          },
          {
            title: "Episodic memory",
            audio: "IELTS13-Tests1-4CD1Track_08.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<p><b>Episodic memory</b></p>
<ul>
<li>the ability to recall details, e.g. the time and [[31]] of past events</li>
<li>different to semantic memory – the ability to remember general information about the [[32]], which does not involve recalling [[33]] information</li>
</ul>
<p><b>Forming episodic memories involves three steps:</b></p>
<p><b>Encoding</b></p>
<ul>
<li>involves receiving and processing information</li>
<li>the more [[34]] given to an event, the more successfully it can be encoded</li>
<li>to remember a [[35]], it is useful to have a strategy for encoding such information</li>
</ul>
<p><b>Consolidation</b></p>
<ul>
<li>how memories are strengthened and stored</li>
<li>most effective when memories can be added to a [[36]] of related information</li>
<li>the [[37]] of retrieval affects the strength of memories</li>
</ul>
<p><b>Retrieval</b></p>
<ul>
<li>memory retrieval often depends on using a prompt, e.g. the [[38]] of an object near to the place where you left your car</li>
</ul>
<p><b>Episodic memory impairments</b></p>
<ul>
<li>these affect people with a wide range of medical conditions</li>
<li>games which stimulate the [[39]] have been found to help people with schizophrenia</li>
<li>children with autism may have difficulty forming episodic memories – possibly because their concept of the [[40]] may be absent</li>
<li>memory training may help autistic children develop social skills</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "races", 2: "insurance", 3: "Jerriz", 4: "25|twenty-five|twenty five", 5: "stadium", 6: "park", 7: "coffee", 8: "leader", 9: "route", 10: "lights",
          11: "C", 12: "B", 13: "C", 14: "B", 15: "B", 16: "A", 17: "C", 18: "E", 19: "B", 20: "D",
          21: "B", 22: "A", 23: "C", 24: "C", 25: "A", 26: "A", 27: "C", 28: "D", 29: "G", 30: "B",
          31: "location", 32: "world", 33: "personal", 34: "attention", 35: "name", 36: "network", 37: "frequency", 38: "colour|color", 39: "brain", 40: "self"
        }
      },

      reading: {
        passages: [
          {
            title: "Bringing cinnamon to Europe",
            text: `
<h3>Bringing cinnamon to Europe</h3>
<p>Cinnamon is a sweet, fragrant spice produced from the inner bark of trees of the genus Cinnamomum, which is native to the Indian sub-continent. It was known in biblical times, and is mentioned in several books of the Bible, both as an ingredient that was mixed with oils for anointing people's bodies, and also as a token indicating friendship among lovers and friends. In ancient Rome, mourners attending funerals burnt cinnamon to create a pleasant scent. Most often, however, the spice found its primary use as an additive to food and drink. In the Middle Ages, Europeans who could afford the spice used it to flavour food, particularly meat, and to impress those around them with their ability to purchase an expensive condiment from the 'exotic' East. At a banquet, a host would offer guests a plate with various spices piled upon it as a sign of the wealth at his or her disposal. Cinnamon was also reported to have health benefits, and was thought to cure various ailments, such as indigestion.</p>
<p>Toward the end of the Middle Ages, the European middle classes began to desire the lifestyle of the elite, including their consumption of spices. This led to a growth in demand for cinnamon and other spices. At that time, cinnamon was transported by Arab merchants, who closely guarded the secret of the source of the spice from potential rivals. They took it from India, where it was grown, on camels via an overland route to the Mediterranean. Their journey ended when they reached Alexandria. European traders sailed there to purchase their supply of cinnamon, then brought it back to Venice. The spice then travelled from that great trading city to markets all around Europe. Because the overland trade route allowed for only small quantities of the spice to reach Europe, and because Venice had a virtual monopoly of the trade, the Venetians could set the price of cinnamon exorbitantly high. These prices, coupled with the increasing demand, spurred the search for new routes to Asia by Europeans eager to take part in the spice trade.</p>
<p>Seeking the high profits promised by the cinnamon market, Portuguese traders arrived on the island of Ceylon in the Indian Ocean toward the end of the 15th century. Before Europeans arrived on the island, the state had organized the cultivation of cinnamon. People belonging to the ethnic group called the Salagama would peel the bark off young shoots of the cinnamon plant in the rainy season, when the wet bark was more pliable. During the peeling process, they curled the bark into the 'stick' shape still associated with the spice today. The Salagama then gave the finished product to the king as a form of tribute. When the Portuguese arrived, they needed to increase production significantly, and so enslaved many other members of the Ceylonese native population, forcing them to work in cinnamon harvesting. In 1518, the Portuguese built a fort on Ceylon, which enabled them to protect the island, so helping them to develop a monopoly in the cinnamon trade and generate very high profits. In the late 16th century, for example, they enjoyed a tenfold profit when shipping cinnamon over a journey of eight days from Ceylon to India.</p>
<p>When the Dutch arrived off the coast of southern Asia at the very beginning of the 17th century, they set their sights on displacing the Portuguese as kings of cinnamon. The Dutch allied themselves with Kandy, an inland kingdom on Ceylon. In return for payments of elephants and cinnamon, they protected the native king from the Portuguese. By 1640, the Dutch broke the 150-year Portuguese monopoly when they overran and occupied their factories. By 1658, they had permanently expelled the Portuguese from the island, thereby gaining control of the lucrative cinnamon trade.</p>
<p>In order to protect their hold on the market, the Dutch, like the Portuguese before them, treated the native inhabitants harshly. Because of the need to boost production and satisfy Europe's ever-increasing appetite for cinnamon, the Dutch began to alter the harvesting practices of the Ceylonese. Over time, the supply of cinnamon trees on the island became nearly exhausted, due to systematic stripping of the bark. Eventually, the Dutch began cultivating their own cinnamon trees to supplement the diminishing number of wild trees available for use.</p>
<p>Then, in 1796, the English arrived on Ceylon, thereby displacing the Dutch from their control of the cinnamon monopoly. By the middle of the 19th century, production of cinnamon reached 1,000 tons a year, after a lower grade quality of the spice became acceptable to European tastes. By that time, cinnamon was being grown in other parts of the Indian Ocean region and in the West Indies, Brazil, and Guyana. Not only was a monopoly of cinnamon becoming impossible, but the spice trade overall was diminishing in economic potential, and was eventually superseded by the rise of trade in coffee, tea, chocolate, and sugar.</p>`,
            groups: [
              {
                instr: "Questions 1–9<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">The Early History of Cinnamon</h4>
<table class="grid">
<tr><td><b>Biblical times:</b></td><td>added to [[1]]<br>used to show [[2]] between people</td></tr>
<tr><td><b>Ancient Rome:</b></td><td>used for its sweet smell at [[3]]</td></tr>
<tr><td><b>Middle Ages:</b></td><td>added to food, especially meat<br>was an indication of a person's [[4]]<br>known as a treatment for [[5]] and other health problems<br>grown in [[6]]<br>merchants used [[7]] to bring it to the Mediterranean<br>arrived in the Mediterranean at [[8]]<br>traders took it to [[9]] and sold it to destinations around Europe</td></tr>
</table>`
              },
              {
                instr: "Questions 10–13<br>Do the following statements agree with the information given in Reading Passage 1?<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
                type: "choice",
                choices: ["TRUE", "FALSE", "NOT GIVEN"],
                items: [
                  { q: 10, text: "The Portuguese had control over the cinnamon trade in Ceylon throughout the 16th century." },
                  { q: 11, text: "The Dutch took over the cinnamon trade from the Portuguese as soon as they arrived in Ceylon." },
                  { q: 12, text: "The trees planted by the Dutch produced larger quantities of cinnamon than the wild trees." },
                  { q: 13, text: "The spice trade maintained its economic importance during the 19th century." }
                ]
              }
            ]
          },
          {
            title: "Oxytocin",
            text: `
<h3>Oxytocin</h3>
<p class="sub"><i>The positive and negative effects of the chemical known as the 'love hormone'</i></p>
<p><b>A</b> Oxytocin is a chemical, a hormone produced in the pituitary gland in the brain. It was through various studies focusing on animals that scientists first became aware of the influence of oxytocin. They discovered that it helps reinforce the bonds between prairie voles, which mate for life, and triggers the motherly behaviour that sheep show towards their newborn lambs. It is also released by women in childbirth, strengthening the attachment between mother and baby. Few chemicals have as positive a reputation as oxytocin, which is sometimes referred to as the 'love hormone'. One sniff of it can, it is claimed, make a person more trusting, empathetic, generous and cooperative. It is time, however, to revise this wholly optimistic view. A new wave of studies has shown that its effects vary greatly depending on the person and the circumstances, and it can impact on our social interactions for worse as well as for better.</p>
<p><b>B</b> Oxytocin's role in human behaviour first emerged in 2005. In a groundbreaking experiment, Markus Heinrichs and his colleagues at the University of Freiburg, Germany, asked volunteers to do an activity in which they could invest money with an anonymous person who was not guaranteed to be honest. The team found that participants who had sniffed oxytocin via a nasal spray beforehand invested more money than those who received a placebo instead. The study was the start of research into the effects of oxytocin on human interactions. 'For eight years, it was quite a lonesome field,' Heinrichs recalls. 'Now, everyone is interested.' These follow-up studies have shown that after a sniff of the hormone, people become more charitable, better at reading emotions on others' faces and at communicating constructively in arguments. Together, the results fuelled the view that oxytocin universally enhanced the positive aspects of our social nature.</p>
<p><b>C</b> Then, after a few years, contrasting findings began to emerge. Simone Shamay-Tsoory at the University of Haifa, Israel, found that when volunteers played a competitive game, those who inhaled the hormone showed more pleasure when they beat other players, and felt more envy when others won. What's more, administering oxytocin also has sharply contrasting outcomes depending on a person's disposition. Jennifer Bartz from Mount Sinai School of Medicine, New York, found that it improves people's ability to read emotions, but only if they are not very socially adept to begin with. Her research also shows that oxytocin in fact reduces cooperation in subjects who are particularly anxious or sensitive to rejection.</p>
<p><b>D</b> Another discovery is that oxytocin's effects vary depending on who we are interacting with. Studies conducted by Carolyn DeClerck of the University of Antwerp, Belgium, revealed that people who had received a dose of oxytocin actually became less cooperative when dealing with complete strangers. Meanwhile, Carsten De Dreu at the University of Amsterdam in the Netherlands discovered that volunteers given oxytocin showed favouritism: Dutch men became quicker to associate positive words with Dutch names than with foreign ones, for example. According to De Dreu, oxytocin drives people to care for those in their social circles and defend them from outside dangers. So, it appears that oxytocin strengthens biases, rather than promoting general goodwill, as was previously thought.</p>
<p><b>E</b> There were signs of these subtleties from the start. Bartz has recently shown that in almost half of the existing research results, oxytocin influenced only certain individuals or in certain circumstances. Where once researchers took no notice of such findings, now a more nuanced understanding of oxytocin's effects is propelling investigations down new lines. To Bartz, the key to understanding what the hormone does lies in pinpointing its core function rather than in cataloguing its seemingly endless effects. There are several hypotheses which are not mutually exclusive. Oxytocin could help to reduce anxiety and fear. Or it could simply motivate people to seek out social connections. She believes that oxytocin acts as a chemical spotlight that shines on social clues – a shift in posture, a flicker of the eyes, a dip in the voice – making people more attuned to their social environment. This would explain why it makes us more likely to look others in the eye and improves our ability to identify emotions. But it could also make things worse for people who are overly sensitive or prone to interpreting social cues in the worst light.</p>
<p><b>F</b> Perhaps we should not be surprised that the oxytocin story has become more perplexing. The hormone is found in everything from octopuses to sheep, and its evolutionary roots stretch back half a billion years. 'It's a very simple and ancient molecule that has been co-opted for many different functions,' says Sue Carter at the University of Illinois, Chicago, USA. 'It affects primitive parts of the brain like the amygdala, so it's going to have many effects on just about everything.' Bartz agrees. 'Oxytocin probably does some very basic things, but once you add our higher-order thinking and social situations, these basic processes could manifest in different ways depending on individual differences and context.'</p>`,
            groups: [
              {
                instr: "Questions 14–17<br>Reading Passage 2 has six paragraphs, <b>A–F</b>.<br>Which paragraph contains the following information?<br><b>NB</b> You may use any letter more than once.",
                type: "match",
                letters: "ABCDEF",
                items: [
                  { q: 14, text: "reference to research showing the beneficial effects of oxytocin on people" },
                  { q: 15, text: "reasons why the effects of oxytocin are complex" },
                  { q: 16, text: "mention of a period in which oxytocin attracted little scientific attention" },
                  { q: 17, text: "reference to people ignoring certain aspects of their research data" }
                ]
              },
              {
                instr: "Questions 18–20<br>Look at the following research findings (Questions 18–20) and the list of researchers below.<br>Match each research finding with the correct researcher, <b>A–F</b>.",
                type: "match",
                boxTitle: "List of Researchers",
                box: [["A", "Markus Heinrichs"], ["B", "Simone Shamay-Tsoory"], ["C", "Jennifer Bartz"], ["D", "Carolyn DeClerck"], ["E", "Carsten De Dreu"], ["F", "Sue Carter"]],
                items: [
                  { q: 18, text: "People are more trusting when affected by oxytocin." },
                  { q: 19, text: "Oxytocin increases people's feelings of jealousy." },
                  { q: 20, text: "The effect of oxytocin varies from one type of person to another." }
                ]
              },
              {
                instr: "Questions 21–26<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                type: "html",
                html: `
<h4 class="center">Oxytocin research</h4>
<p>The earliest findings about oxytocin and bonding came from research involving [[21]]. It was also discovered that humans produce oxytocin during [[22]]. An experiment in 2005, in which participants were given either oxytocin or a [[23]], reinforced the belief that the hormone had a positive effect.</p>
<p>However, later research suggests that this is not always the case. A study at the University of Haifa where participants took part in a [[24]] revealed the negative emotions which oxytocin can trigger. A study at the University of Antwerp showed people's lack of willingness to help [[25]] while under the influence of oxytocin. Meanwhile, research at the University of Amsterdam revealed that people who have been given oxytocin consider [[26]] that are familiar to them in their own country to have more positive associations than those from other cultures.</p>`
              }
            ]
          },
          {
            title: "Making the most of trends",
            text: `
<h3>MAKING THE MOST OF TRENDS</h3>
<p class="sub"><i>Experts from Harvard Business School give advice to managers</i></p>
<p>Most managers can identify the major trends of the day. But in the course of conducting research in a number of industries and working directly with companies, we have discovered that managers often fail to recognize the less obvious but profound ways these trends are influencing consumers' aspirations, attitudes, and behaviors. This is especially true of trends that managers view as peripheral to their core markets.</p>
<p>Many ignore trends in their innovation strategies or adopt a wait-and-see approach and let competitors take the lead. At a minimum, such responses mean missed profit opportunities. At the extreme, they can jeopardize a company by ceding to rivals the opportunity to transform the industry. The purpose of this article is twofold: to spur managers to think more expansively about how trends could engender new value propositions in their core markets, and to provide some high-level advice on how to make market research and product development personnel more adept at analyzing and exploiting trends.</p>
<p>One strategy, known as 'infuse and augment', is to design a product or service that retains most of the attributes and functions of existing products in the category but adds others that address the needs and desires unleashed by a major trend. A case in point is the Poppy range of handbags, which the firm Coach created in response to the economic downturn of 2008. The Coach brand had been a symbol of opulence and luxury for nearly 70 years, and the most obvious reaction to the downturn would have been to lower prices. However, that would have risked cheapening the brand's image. Instead, they initiated a consumer-research project which revealed that customers were eager to lift themselves and the country out of tough times. Using these insights, Coach launched the lower-priced Poppy handbags, which were in vibrant colors, and looked more youthful and playful than conventional Coach products. Creating the sub-brand allowed Coach to avert an across-the-board price cut. In contrast to the many companies that responded to the recession by cutting prices, Coach saw the new consumer mindset as an opportunity for innovation and renewal.</p>
<p>A further example of this strategy was supermarket Tesco's response to consumers' growing concerns about the environment. With that in mind, Tesco, one of the world's top five retailers, introduced its Greener Living program, which demonstrates the company's commitment to protecting the environment by involving consumers in ways that produce tangible results. For example, Tesco customers can accumulate points for such activities as reusing bags, recycling cans and printer cartridges, and buying home-insulation materials. Like points earned on regular purchases, these green points can be redeemed for cash. Tesco has not abandoned its traditional retail offerings but augmented its business with these innovations, thereby infusing its value proposition with a green streak.</p>
<p>A more radical strategy is 'combine and transcend'. This entails combining aspects of the product's existing value proposition with attributes addressing changes arising from a trend, to create a novel experience – one that may land the company in an entirely new market space. At first glance, spending resources to incorporate elements of a seemingly irrelevant trend into one's core offerings sounds like it's hardly worthwhile. But consider Nike's move to integrate the digital revolution into its reputation for high-performance athletic footwear. In 2006, they teamed up with technology company Apple to launch Nike+, a digital sports kit comprising a sensor that attaches to the running shoe and a wireless receiver that connects to the user's iPod. By combining Nike's original value proposition for amateur athletes with one for digital consumers, the Nike+ sports kit and web interface moved the company from a focus on athletic apparel to a new plane of engagement with its customers.</p>
<p>A third approach, known as 'counteract and reaffirm', involves developing products or services that stress the values traditionally associated with the category in ways that allow consumers to oppose – or at least temporarily escape from – the aspects of trends they view as undesirable. A product that accomplished this is the ME2, a video game created by Canada's iToys. By reaffirming the toy category's association with physical play, the ME2 counteracted some of the widely perceived negative impacts of digital gaming devices. Like other handheld games, the device featured a host of exciting interactive games, a full-color LCD screen, and advanced 3D graphics. What set it apart was that it incorporated the traditional physical component of children's play: it contained a pedometer, which tracked and awarded points for physical activity (walking, running, biking, skateboarding, climbing stairs). The child could use the points to enhance various virtual skills needed for the video game. The ME2, introduced in mid-2008, catered to kids' huge desire to play video games while countering the negatives, such as associations with lack of exercise and obesity.</p>
<p>Once you have gained perspective on how trend-related changes in consumer opinions and behaviors impact on your category, you can determine which of our three innovation strategies to pursue. When your category's basic value proposition continues to be meaningful for consumers influenced by the trend, the infuse-and-augment strategy will allow you to reinvigorate the category. If analysis reveals an increasing disparity between your category and consumers' new focus, your innovations need to transcend the category to integrate the two worlds. Finally, if aspects of the category clash with undesired outcomes of a trend, such as associations with unhealthy lifestyles, there is an opportunity to counteract those changes by reaffirming the core values of your category.</p>
<p>Trends – technological, economic, environmental, social, or political – that affect how people perceive the world around them and shape what they expect from products and services present firms with unique opportunities for growth.</p>`,
            groups: [
              {
                instr: "Questions 27–31<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.",
                type: "mcq",
                items: [
                  { q: 27, text: "In the first paragraph, the writer says that most managers", options: ["fail to spot the key consumer trends of the moment.", "make the mistake of focusing only on the principal consumer trends.", "misinterpret market research data relating to current consumer trends.", "are unaware of the significant impact that trends have on consumers' lives."] },
                  { q: 28, text: "According to the third paragraph, Coach was anxious to", options: ["follow what some of its competitors were doing.", "maintain its prices throughout its range.", "safeguard its reputation as a manufacturer of luxury goods.", "modify the entire look of its brand to suit the economic climate."] },
                  { q: 29, text: "What point is made about Tesco's Greener Living programme?", options: ["It did not require Tesco to modify its core business activities.", "It succeeded in attracting a more eco-conscious clientele.", "Its main aim was to raise consumers' awareness of environmental issues.", "It was not the first time that Tesco had implemented such an initiative."] },
                  { q: 30, text: "What does the writer suggest about Nike's strategy?", options: ["It was an extremely risky strategy at the time.", "It was a strategy that only a major company could afford to follow.", "It was the type of strategy that would not have been possible in the past.", "It was the kind of strategy which might appear to have few obvious benefits."] },
                  { q: 31, text: "What was original about the ME2?", options: ["It contained technology that had been developed for the sports industry.", "It appealed to young people who were keen to improve their physical fitness.", "It took advantage of a current trend for video games with colourful 3D graphics.", "It was a handheld game that addressed people's concerns about unhealthy lifestyles."] }
                ]
              },
              {
                instr: "Questions 32–37<br>Look at the following statements (Questions 32–37) and the list of companies below.<br>Match each statement with the correct company, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.<br><b>NB</b> You may use any letter more than once.",
                type: "match",
                boxTitle: "List of companies",
                box: [["A", "Coach"], ["B", "Tesco"], ["C", "Nike"], ["D", "iToys"]],
                items: [
                  { q: 32, text: "It turned the notion that its products could have harmful effects to its own advantage." },
                  { q: 33, text: "It extended its offering by collaborating with another manufacturer." },
                  { q: 34, text: "It implemented an incentive scheme to demonstrate its corporate social responsibility." },
                  { q: 35, text: "It discovered that customers had a positive attitude towards dealing with difficult circumstances." },
                  { q: 36, text: "It responded to a growing lifestyle trend in an unrelated product sector." },
                  { q: 37, text: "It successfully avoided having to charge its customers less for its core products." }
                ]
              },
              {
                instr: "Questions 38–40<br>Complete each sentence with the correct ending, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b> below.",
                type: "match",
                box: [["A", "employ a combination of strategies to maintain your consumer base."], ["B", "identify the most appropriate innovation strategy to use."], ["C", "emphasise your brand's traditional values with the counteract-and-affirm strategy."], ["D", "use the combine-and-transcend strategy to integrate the two worlds."]],
                items: [
                  { q: 38, text: "If there are any trend-related changes impacting on your category, you should" },
                  { q: 39, text: "If a current trend highlights a negative aspect of your category, you should" },
                  { q: 40, text: "If the consumers' new focus has an increasing lack of connection with your offering, you should" }
                ]
              }
            ]
          }
        ],
        answers: {
          1: "oils", 2: "friendship", 3: "funerals", 4: "wealth", 5: "indigestion", 6: "India", 7: "camels", 8: "Alexandria", 9: "Venice",
          10: "TRUE", 11: "FALSE", 12: "NOT GIVEN", 13: "FALSE",
          14: "B", 15: "F", 16: "B", 17: "E", 18: "A", 19: "B", 20: "C",
          21: "animals", 22: "childbirth", 23: "placebo", 24: "game", 25: "strangers", 26: "names",
          27: "D", 28: "C", 29: "A", 30: "D", 31: "D", 32: "D", 33: "C", 34: "B", 35: "A", 36: "C", 37: "A", 38: "B", 39: "C", 40: "D"
        }
      },

      writing: [
        {
          task: 1, minutes: 20, words: 150,
          prompt: "<p><b><i>The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.</i></b></p><p><b><i>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</i></b></p>",
          image: "assets/c13/t2-w1.png"
        },
        {
          task: 2, minutes: 40, words: 250,
          prompt: "<p><b><i>Some people believe that nowadays we have too many choices.</i></b></p><p><b><i>To what extent do you agree or disagree with this statement?</i></b></p><p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>"
        }
      ],

      speaking: `
<h4>Part 1</h4>
<p>The examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.</p>
<p><b>Age</b></p>
<ul>
<li>Are you happy to be the age you are now? [Why/Why not?]</li>
<li>When you were a child, did you think a lot about your future? [Why/Why not?]</li>
<li>Do you think you have changed as you have got older? [Why/Why not?]</li>
<li>What will be different about your life in the future? [Why]</li>
</ul>
<h4>Part 2</h4>
<div class="cue"><b>Describe a time when you started using a new technological device (e.g. a new computer or phone).</b><br><br>You should say:<br>&nbsp;&nbsp;what device you started using<br>&nbsp;&nbsp;why you started using this device<br>&nbsp;&nbsp;how easy or difficult it was to use<br>and explain how helpful this device was to you.</div>
<p class="muted">You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say.</p>
<h4>Part 3</h4>
<p><b>Technology and education</b></p>
<ul>
<li>What is the best age for children to start computer lessons?</li>
<li>Do you think that schools should use more technology to help children learn?</li>
<li>Do you agree or disagree that computers will replace teachers one day?</li>
</ul>
<p><b>Technology and society</b></p>
<ul>
<li>How much has technology improved how we communicate with each other?</li>
<li>Do you agree that there are still many more major technological innovations to be made?</li>
<li>Could you suggest some reasons why some people are deciding to reduce their use of technology?</li>
</ul>`
    }
    ,
    // ================= TEST 3 =================
    {
      n: 3,
      listening: {
        parts: [
          {
            title: "Moving to Banford City",
            audio: "IELTS13-Tests1-4CD2Track_01.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Moving to Banford City</h4>
<p><i>Example</i><br>Linda recommends living in suburb of: <u>Dalton</u></p>
<p><b>Accommodation</b></p>
<ul><li>Average rent: £ [[1]] a month</li></ul>
<p><b>Transport</b></p>
<ul>
<li>Linda travels to work by [[2]]</li>
<li>Limited [[3]] in city centre</li>
<li>Trains to London every [[4]] minutes</li>
<li>Poor train service at [[5]]</li>
</ul>
<p><b>Advantages of living in Banford</b></p>
<ul>
<li>New [[6]] opened recently</li>
<li>[[7]] has excellent reputation</li>
<li>Good [[8]] on Bridge Street</li>
</ul>
<p><b>Meet Linda</b></p>
<ul>
<li>Meet Linda on [[9]] after 5.30 pm</li>
<li>In the [[10]] opposite the station</li>
</ul>`
              }
            ]
          },
          {
            title: "Physical activities",
            audio: "IELTS13-Tests1-4CD2Track_02.mp3",
            groups: [
              {
                instr: "Questions 11–16<br>What advantage does the speaker mention for each of the following physical activities?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–G</b>, next to Questions 11–16.",
                type: "match",
                boxTitle: "Advantages",
                box: [["A", "not dependent on season"], ["B", "enjoyable"], ["C", "low risk of injury"], ["D", "fitness level unimportant"], ["E", "sociable"], ["F", "fast results"], ["G", "motivating"]],
                items: [
                  { q: 11, text: "using a gym" }, { q: 12, text: "running" }, { q: 13, text: "swimming" },
                  { q: 14, text: "cycling" }, { q: 15, text: "doing yoga" }, { q: 16, text: "training with a personal trainer" }
                ]
              },
              {
                instr: "Questions 17 and 18<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [17, 18],
                text: "For which <b>TWO</b> reasons does the speaker say people give up going to the gym?",
                options: ["lack of time", "loss of confidence", "too much effort required", "high costs", "feeling less successful than others"]
              },
              {
                instr: "Questions 19 and 20<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [19, 20],
                text: "Which <b>TWO</b> pieces of advice does the speaker give for setting goals?",
                options: ["write goals down", "have achievable aims", "set a time limit", "give yourself rewards", "challenge yourself"]
              }
            ]
          },
          {
            title: "Project on using natural dyes to colour fabrics",
            audio: "IELTS13-Tests1-4CD2Track_03.mp3",
            groups: [
              {
                instr: "Questions 21–24<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Project on using natural dyes to colour fabrics",
                items: [
                  { q: 21, text: "What first inspired Jim to choose this project?", options: ["textiles displayed in an exhibition", "a book about a botanic garden", "carpets he saw on holiday"] },
                  { q: 22, text: "Jim eventually decided to do a practical investigation which involved", options: ["using a range of dyes with different fibres.", "applying different dyes to one type of fibre.", "testing one dye and a range of fibres."] },
                  { q: 23, text: "When doing his experiments, Jim was surprised by", options: ["how much natural material was needed to make the dye.", "the fact that dyes were widely available on the internet.", "the time that he had to leave the fabric in the dye."] },
                  { q: 24, text: "What problem did Jim have with using tartrazine as a fabric dye?", options: ["It caused a slight allergic reaction.", "It was not a permanent dye on cotton.", "It was ineffective when used on nylon."] }
                ]
              },
              {
                instr: "Questions 25–30<br>What problem is identified with each of the following natural dyes?<br>Choose <b>SIX</b> answers from the box and write the correct letter, <b>A–H</b>, next to Questions 25–30.",
                type: "match",
                boxTitle: "Problems",
                box: [["A", "It is expensive."], ["B", "The colour is too strong."], ["C", "The colour is not long-lasting."], ["D", "It is very poisonous."], ["E", "It can damage the fabric."], ["F", "The colour may be unexpected."], ["G", "It is unsuitable for some fabrics."], ["H", "It is not generally available."]],
                items: [
                  { q: 25, text: "turmeric" }, { q: 26, text: "beetroot" }, { q: 27, text: "Tyrian purple" },
                  { q: 28, text: "logwood" }, { q: 29, text: "cochineal" }, { q: 30, text: "metal oxide" }
                ]
              }
            ]
          },
          {
            title: "The sleepy lizard (tiliqua rugosa)",
            audio: "IELTS13-Tests1-4CD2Track_04.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">The sleepy lizard (<i>tiliqua rugosa</i>)</h4>
<p><b>Description</b></p>
<ul>
<li>They are common in Western and South Australia</li>
<li>They are brown, but recognisable by their blue [[31]]</li>
<li>They are relatively large</li>
<li>Their diet consists mainly of [[32]]</li>
<li>Their main predators are large birds and [[33]]</li>
</ul>
<p><b>Navigation study</b></p>
<ul><li>One study found that lizards can use the [[34]] to help them navigate</li></ul>
<p><b>Observations in the wild</b></p>
<ul><li>Observations show that these lizards keep the same [[35]] for several years</li></ul>
<p><b>What people want</b></p>
<ul><li>Possible reasons:
  <ul>
  <li>to improve the survival of their young (but little [[36]] has been noted between parents and children)</li>
  <li>to provide [[37]] for female lizards</li>
  </ul></li></ul>
<p><b>Tracking study</b></p>
<ul>
<li>A study was carried out using GPS systems attached to the [[38]] of the lizards</li>
<li>This provided information on the lizards' location and even the number of [[39]] taken</li>
<li>It appeared that the lizards were trying to avoid one another</li>
<li>This may be in order to reduce chances of [[40]]</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "850", 2: "bike|bicycle", 3: "parking", 4: "30|thirty", 5: "weekend(s)", 6: "cinema", 7: "hospital", 8: "dentist", 9: "Thursday", 10: "café|cafe",
          11: "F", 12: "D", 13: "A", 14: "B", 15: "C", 16: "G", 17: "B", 18: "C", 19: "B", 20: "D",
          21: "C", 22: "A", 23: "A", 24: "B", 25: "C", 26: "F", 27: "H", 28: "D", 29: "A", 30: "E",
          31: "tongue(s)", 32: "plants", 33: "snakes", 34: "sky", 35: "partner(s)", 36: "contact", 37: "protection", 38: "tail(s)", 39: "steps", 40: "injury|injuries"
        }
      }
    },

    // ================= TEST 4 =================
    {
      n: 4,
      listening: {
        parts: [
          {
            title: "Alex's Training",
            audio: "IELTS13-Tests1-4CD2Track_05.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">Alex's Training</h4>
<p><i>Example</i><br>Alex completed his training in <u>2014</u></p>
<p><b>About the applicant:</b></p>
<ul>
<li>At first, Alex did his training in the [[1]] department.</li>
<li>Alex didn't have a qualification from school in [[2]].</li>
<li>Alex thinks he should have done the diploma in [[3]] skills.</li>
<li>Age of other trainees: the youngest was [[4]].</li>
</ul>
<p><b>Benefits of doing training at JPNW:</b></p>
<ul>
<li>Lots of opportunities because of the size of the organisation.</li>
<li>Trainees receive the same amount of [[5]] as permanent staff.</li>
<li>The training experience increases people's confidence a lot.</li>
<li>Trainees go to [[6]] one day per month.</li>
<li>The company is in a convenient [[7]].</li>
</ul>
<p><b>Advice for interview:</b></p>
<ul>
<li>Don't wear [[8]].</li>
<li>Don't be [[9]].</li>
<li>Make sure you [[10]].</li>
</ul>`
              }
            ]
          },
          {
            title: "The Snow Centre",
            audio: "IELTS13-Tests1-4CD2Track_06.mp3",
            groups: [
              {
                instr: "Questions 11–16<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "The Snow Centre",
                items: [
                  { q: 11, text: "Annie recommends that when cross-country skiing, the visitors should", options: ["get away from the regular trails.", "stop to enjoy views of the scenery.", "go at a slow speed at the beginning."] },
                  { q: 12, text: "What does Annie tell the group about this afternoon's dog-sled trip?", options: ["Those who want to can take part in a race.", "Anyone has the chance to drive a team of dogs.", "One group member will be chosen to lead the trail."] },
                  { q: 13, text: "What does Annie say about the team relay event?", options: ["All participants receive a medal.", "The course is 4 km long.", "Each team is led by a teacher."] },
                  { q: 14, text: "On the snow-shoe trip, the visitors will", options: ["visit an old gold mine.", "learn about unusual flowers.", "climb to the top of a mountain."] },
                  { q: 15, text: "The cost of accommodation in the mountain hut includes", options: ["a supply of drinking water.", "transport of visitors' luggage.", "cooked meals."] },
                  { q: 16, text: "If there is a storm while the visitors are in the hut, they should", options: ["contact the bus driver.", "wait until the weather improves.", "use the emergency locator beacon."] }
                ]
              },
              {
                instr: "Questions 17–20<br>What information does Annie give about skiing on each of the following mountain trails?<br>Choose <b>FOUR</b> answers from the box and write the correct letter, <b>A–F</b>, next to Questions 17–20.",
                type: "match",
                boxTitle: "Information",
                box: [["A", "It has a good place to stop and rest."], ["B", "It is suitable for all abilities."], ["C", "It involves crossing a river."], ["D", "It demands a lot of skill."], ["E", "It may be closed in bad weather."], ["F", "It has some very narrow sections."]],
                items: [
                  { q: 17, text: "Highland Trail" }, { q: 18, text: "Pine Trail" }, { q: 19, text: "Stony Trail" }, { q: 20, text: "Loser's Trail" }
                ]
              }
            ]
          },
          {
            title: "Labels giving nutritional information on food packaging",
            audio: "IELTS13-Tests1-4CD2Track_07.mp3",
            groups: [
              {
                instr: "Questions 21–26<br>Choose the correct letter, <b>A</b>, <b>B</b> or <b>C</b>.",
                type: "mcq",
                heading: "Labels giving nutritional information on food packaging",
                items: [
                  { q: 21, text: "What was Jack's attitude to nutritional food labels before this project?", options: ["He didn't read everything on them.", "He didn't think they were important.", "He thought they were too complicated."] },
                  { q: 22, text: "Alice says that before doing this project,", options: ["she was unaware of what certain foods contained.", "she was too lazy to read food labels.", "she was only interested in the number of calories."] },
                  { q: 23, text: "When discussing supermarket brands of pizza, Jack agrees with Alice that", options: ["the list of ingredients is shocking.", "he will hesitate before buying pizza again.", "the nutritional label is misleading."] },
                  { q: 24, text: "Jack prefers the daily value system to other labelling systems because it is", options: ["more accessible.", "more logical.", "more comprehensive."] },
                  { q: 25, text: "What surprised both students about one flavour of crisps?", options: ["The percentage of artificial additives given was incorrect.", "The products did not contain any meat.", "The labels did not list all the ingredients."] },
                  { q: 26, text: "What do the students think about research into the impact of nutritional food labelling?", options: ["It did not produce clear results.", "It focused on the wrong people.", "It made unrealistic recommendations."] }
                ]
              },
              {
                instr: "Questions 27 and 28<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [27, 28],
                text: "Which <b>TWO</b> things surprised the students about the traffic-light system for nutritional labels?",
                options: ["its widespread use", "the fact that it is voluntary for supermarkets", "how little research was done before its introduction", "its unpopularity with food manufacturers", "the way that certain colours are used"]
              },
              {
                instr: "Questions 29 and 30<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
                type: "multi", qs: [29, 30],
                text: "Which <b>TWO</b> things are true about the participants in the study on the traffic-light system?",
                options: ["They had low literacy levels.", "They were regular consumers of packaged food.", "They were selected randomly.", "They were from all socio-economic groups.", "They were interviewed face-to-face."]
              }
            ]
          },
          {
            title: "The history of coffee",
            audio: "IELTS13-Tests1-4CD2Track_08.mp3",
            groups: [
              {
                instr: "Complete the notes below.<br>Write <b>ONE WORD ONLY</b> for each answer.",
                type: "html",
                html: `
<h4 class="center">The history of coffee</h4>
<p><b>Coffee in the Arab world</b></p>
<ul>
<li>There was small-scale trade in wild coffee from Ethiopia.</li>
<li>1522: Coffee was approved in the Ottoman court as a type of medicine.</li>
<li>1623: In Constantinople, the ruler ordered the [[31]] of every coffee house.</li>
</ul>
<p><b>Coffee arrives in Europe (17th century)</b></p>
<ul>
<li>Coffee shops were compared to [[32]].</li>
<li>They played an important part in social and [[33]] changes.</li>
</ul>
<p><b>Coffee and European colonisation</b></p>
<ul>
<li>European powers established coffee plantations in their colonies.</li>
<li>Types of coffee were often named according to the [[34]] they came from.</li>
<li>In Brazil and the Caribbean, most cultivation depended on [[35]].</li>
<li>In Java, coffee was used as a form of [[36]].</li>
<li>Coffee became almost as important as [[37]].</li>
<li>The move towards the consumption of [[38]] in Britain did not also take place in the USA.</li>
</ul>
<p><b>Coffee in the 19th century</b></p>
<ul>
<li>Prices dropped because of improvements in [[39]].</li>
<li>Industrial workers found coffee helped them to work at [[40]].</li>
</ul>`
              }
            ]
          }
        ],
        answers: {
          1: "Finance", 2: "Maths|Math|Mathematics", 3: "business", 4: "17|seventeen", 5: "holiday(s)|vacation(s)", 6: "college", 7: "location", 8: "jeans", 9: "late", 10: "smile",
          11: "A", 12: "B", 13: "A", 14: "C", 15: "A", 16: "B", 17: "B", 18: "D", 19: "A", 20: "E",
          21: "A", 22: "A", 23: "C", 24: "C", 25: "B", 26: "A", 27: "B", 28: "C", 29: "D", 30: "E",
          31: "destruction", 32: "universities|university", 33: "political", 34: "port(s)", 35: "slaves|slavery", 36: "taxation", 37: "sugar", 38: "tea", 39: "transportation", 40: "night"
        }
      }
    }
  ]
});
