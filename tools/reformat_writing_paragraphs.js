const fs = require('fs');

// Reads data/recent-writing.js
let fileContent = fs.readFileSync('data/recent-writing.js', 'utf8');

// Mapping of test number to an array of paragraphs [intro, overview, body1, body2, ...]
const splits = {
  2: [
    "The two pie charts compare the proportion of time working adults in a particular country devoted to various daily activities in 1958 and 2008.",
    "At first glance, it is evident that work and sleep dominated people's routines in both years. However, over the 50-year period, working hours expanded considerably, while the share of time spent on sleeping and socialising outside the home declined.",
    "In 1958, the largest portion of the day was allocated to working, at 33%, closely followed by sleeping, which accounted for 32%. By 2008, the figure for work had risen markedly to 42%, whereas sleeping dropped substantially to only a quarter of the day. Likewise, going out with friends or family, which previously represented nearly one-fifth of daily activities (19%), fell dramatically to a mere 6%.",
    "By contrast, indoor and solitary pursuits became more prevalent. Relaxing at home doubled from 8% to 13%, while engaging in hobbies and sports edged up from 6% to 8%. Time spent commuting also tripled, from 2% in 1958 to 6% in 2008, reflecting perhaps longer distances or increased reliance on transport. In summary, the data suggest a clear shift over time towards longer working hours and home-based leisure, accompanied by a decline in sleeping and outdoor social interactions."
  ],
  3: [
    "The bar chart gives information about the rate of self-employment in the working demographics of five distinct nations in two different years 1998 and 2008.",
    "Overall, Greece and Turkey boasted the largest self-employed population, far exceeding other countries. It is also noticeable that over the course of a decade, there was positive growth in the segment of people working for themselves in Russia, Slovakia, and the Czech Republic while Greece and Turkey witnessed considerable decreases in their numbers.",
    "Russia, Slovakia, and the Czech Republic were the countries with the lowest levels of self-employment across the chart, with 3%, 5%, and 11% of the workforce working for themselves in 1998. 10 years later, both Russia and the Czech Republic experienced rather minimal increases in their numbers, growing to 5% and 14% respectively. Witnessing a similar trend, albeit at a more pronounced rate, Slovakia saw its self-employed workforce doubling to 12%.",
    "At the beginning of the timescale, over half of the Turkey's working populace was self-employed, 10% higher than that of Greece. However, the level of self-employed workforce in Turkey plummeted by 16% within the next 10 years, marking the most significant change in the chart. A similar pattern was observed in Greece, whose percentage had dwindled to 35% by 2008. It is also worth noting that despite these variations, the pecking order remained the same, with Turkey leading, followed by Greece while the Czech Republic, Slovakia, and Russia lagged behind."
  ],
  4: [
    "The graph illustrates the percentage of workers who were absent due to illness for a day or more from five different European countries: the Netherlands, France, Sweden, the United Kingdom, and Germany, over a 20-year period, from 1991 to 2001.",
    "Overall, the share of workers from the Netherlands and Sweden showed increasing trends, while the workers in France experienced a fall in percentages. Also, in the United Kingdom and Germany, these percentages fluctuated around 2% throughout the whole period.",
    "Initially, France had the leading percentage at 5% in 1991, followed closely by the Netherlands at slightly less than that number. Sweden was ranked third at 3%, and the United Kingdom and Germany approximately started at 2% in the same year. Not long after, the Netherlands surpassed France and experienced a peak at slightly less than 6% in 1992, ranking first among all the other countries and remaining so until the end of the period. Meanwhile, France's percentage continued to decrease until 1996 and remained slightly more than 3% thereafter.",
    "In contrast, Sweden initiated a decline from the same year, reaching almost 5% by the end, in 2001. On the other hand, the United Kingdom and Germany did not show any dramatic changes. The United Kingdom remained above and Germany stayed below 2% throughout the whole time."
  ],
  5: [
    "The bar chart compares the percentage of males in a certain country who prefer watching sports with those who enjoy participating in them across six different sporting activities.",
    "Overall, it is clear that team sports such as football, basketball, and rugby are more popular to watch, while individual sports like fishing and badminton attract more participants. Football had the highest viewing preference, whereas fishing was the most popular sport to take part in.",
    "In terms of watching sports, football topped the list with around 40% of males choosing to watch it, followed closely by basketball at approximately 36%. Rugby and horse riding also had higher viewing rates than participation, standing at about 28% and 35% respectively. Notably, the gap between watching and participating in football and horse-related sports was significant, with roughly double the number of watchers compared to players.",
    "Conversely, fishing stood out as the most popular sport for participation, with 50% of males involved in it, while only about 12% preferred watching it. Badminton had a relatively balanced distribution, with participation (just under 30%) slightly exceeding viewing rates (roughly 27%). Rugby was the only team sport where the proportion of participants (20%) remained notably lower than viewers."
  ],
  6: [
    "The given map delineates the information about how Shalton village changed its plan between 1910 and 2010.",
    "Overall, it is evident from the bird's eye view that the building, which was constructed in 1910, remained almost the same. However, a number of new houses were built in the latter chart.",
    "To begin with, in 1910, there were three main roads: School Road, London Road, and High Street, which connected the entire plan with each other. In the upper right corner of London Street, a post office was built, whereas a large house was placed in the centre of the plan, and a cafe was just below the large house. Furthermore, the School and Butchers were built along the school on the South-East corner.",
    "In regards to further details, the school, Post office, and cafe remained the same in 2010. Large houses in the centre were demolished and replaced by a small road along with five houses intersecting London Street. Despite this, a plethora of homes were constructed around London Street and High Street. While in the North corner, houses were removed to make room for supermarkets and parking, respectively."
  ],
  7: [
    "The bar chart illustrates the proportion of adults with the completion of high school in 6 different countries (Germany, the USA, Russia, South Korea, Brazil, and China) in 2010.",
    "Overall, in 2010, the younger age group across six nations generally had higher percentages of high school graduates compared to the older generations, except for the US. Additionally, while Russia and South Korea had the highest rate of high school graduation of the younger group, Brazil and China had the lowest figure in both demographics.",
    "Looking at the younger age group (25-34 years old), South Korea accounted for the highest rate, with nearly all adults having a high school education. This number was closely followed by Russia, with over 90%. While Germany and the US also demonstrated equally high numbers, with both of them standing at 88%, the remaining two countries (Brazil and China) were far behind, with only 50% and 20% respectively.",
    "Although their percentages were lower, the ranking of Brazil and China was similarly applied for the older age group (55-64 years old), with 25% and over 10% being recorded in turn. Witnessing a contrasting pattern, America and Germany led the rank with their figures standing at 90% and 85% respectively. It is noticeable that the figure for Russia remained high at approximately 70%. However, unlike the young age group, South Korea possessed rather low figures for this old demographic, with under 50% of adults completing high school."
  ],
  8: [
    "The two maps illustrate the layout of a TV centre ten years ago and at present.",
    "Overall, the centre has undergone significant redevelopment. While some areas have been rearranged, a number of sections have remained unchanged. Notably, a canteen has been added to the central part of the building to improve convenience for both staff and visitors.",
    "A decade ago, the northern section of the building contained several rooms. From left to right, these included the clothing room, a dress store, Office 3, a studio, a customer service room and a make-up room. The central area accommodated staff-related facilities. While the reception was located on the far west side, Office 2 and a canteen were situated nearby. To the right of these were Office 1, alongside a records room and a waiting area. Outside the building, a car park was situated to the south, while the eastern side featured a wooded area.",
    "Since then, the building has undergone significant modifications. The most notable change has been the extension of the car park at the expense of the wooded area. Although, a clothing room, reception, a storage room, a studio, a customer service room and a make-up area have remained in their original position. What once used to be Office 1 is now a canteen at the heart of three offices and a waiting area."
  ],
  9: [
    "The diagrams illustrate the transformations that have taken place in the town of Bridgetown between the years 1700 and 2000.",
    "Overall, there have been significant developments in Bridgetown over the three centuries, with notable changes in infrastructure and land use.",
    "In 1700, Bridgetown featured a simple layout with a bridge facilitating road traffic over a river, alongside a marketplace and a castle located to the north. The landscape was rural, with farmland to the south of the river and woods to the north.",
    "By the year 2000, Bridgetown had evolved considerably. The original bridge remained, but it was now complemented by a railway line, reflecting improvements in transportation. The presence of a school further indicates a shift towards urban living. The area of the south of the river experienced substantial development, as evidenced by the introduction of a bypass road and newly constructed residential zones. The overall increase in infrastructure suggests a shift towards a more urbanized and organized town structure, accommodating a growing population."
  ],
  11: [
    "The given pie charts compare the proportions of time spent on different activities in the office in the US in 1980 and 2000.",
    "Overall, it is noticeable that activities, namely computer, phone, paper documents, and meetings, changed noticeably, while other activities and face-to-face communication remained unchanged. Another interesting point is that employees did not spend time on email in 1980, but they started to allocate time for that twenty years later.",
    "As regards the activities that changed the most, the phone was the most popular activity (30%) at the beginning, but then it dropped significantly to just under one-fifth of the total. Although the computer was the least popular in 1980, it went up dramatically to almost one-third of the total. Moreover, the paper halved from 20% to 10%. It was also the case for the meetings, which decreased to 6%.",
    "The activities that stayed the same were face-to-face communication (14%) and other activities (15%). Additionally, despite the fact that email was not in the list of activities in 1980, people started to allocate time to, which accounted for 8%."
  ],
  12: [
    "The line graph illustrates the percentage of workers who took sickness absences in five European countries—Germany, Sweden, the Netherlands, the UK, and France—between 1991 and 2001.",
    "Overall, the Netherlands had the highest percentage of workers taking sickness absences for most of the period, while Germany recorded the lowest figures. Over the decade, the percentage decreased overall in the Netherlands and France, whereas Sweden and the UK experienced upward trends. Germany, meanwhile, saw a slight decline followed by a period of stability.",
    "In 1991, the Netherlands had the highest percentage of workers taking sickness absences, at around 5.5%, followed by France at approximately 4.5%. Both countries experienced downward trends over the following years. The figure for the Netherlands fell considerably to about 3.5% in 1996 before gradually increasing again to around 4.8% by 2001. France, on the other hand, showed a consistent decrease throughout the decade, reaching its lowest point of around 3% by the end of the period. Germany started with the lowest percentage of workers taking sickness absences, at just over 1.5% in 1991. This figure decreased slightly over the next few years and then remained stable at around 1.25% from 1995 onwards.",
    "In contrast, Sweden and the UK, which began with relatively low figures, experienced upward trends. Sweden saw a steady rise, overtaking Germany and the UK in the late 1990s and reaching nearly 4% by 2001. The UK's figure also increased gradually, from about 2% in 1991 to just over 3% in 2001."
  ],
  13: [
    "The two plans depict the layout of a small theatre in 2010 and 2012. The changes between the two years are significant, with notable additions to the backstage area and a reorganization of some public spaces.",
    "Overall, the theatre underwent several key modifications, including the addition of a corridor and a restaurant, as well as the installation of showers. The main auditorium and stage remained in their original locations, but the spaces for administrative and ticketing offices, as well as the café, were rearranged.",
    "In 2010, the theatre had a simple layout with the main auditorium centrally positioned, surrounded by a dressing room, administrative office, ticket office, and a café. The seating arrangement in the auditorium was unchanged, but the café was located at the bottom left of the plan. The dressing room and stage were situated at the top, with the administrative and ticket offices in the bottom-right corner.",
    "By 2012, the design had changed quite a bit. A new corridor was introduced along the top of the plan, providing easier access to the dressing room and stage. The café and ticket office were relocated to the lower right, while a new restaurant was added to the bottom left of the plan, replacing the café's previous position. Additionally, showers were installed behind the stage area to the right of the dressing room. These changes improved the functionality of the theatre, enhancing both backstage and public access areas."
  ],
  14: [
    "The table illustrates population growth rates, average births per woman and life expectancy at birth in high-, middle- and low-income countries in 2002 and 2004.",
    "Overall, there were modest declines in both population growth and fertility across all income groups, while life expectancy improved in each category. Additionally, low-income countries consistently recorded the highest rates of population growth and average births per woman, whereas high-income nations boasted the greatest life expectancy at birth.",
    "In 2002, low-income countries exhibited the highest population growth at 2.0 %, compared with 0.9 % in middle-income and 0.8 % in high-income nations. Average births per woman followed a similar pattern: 3.9 in low-income, 2.2 in middle-income and 1.7 in high-income countries. Life expectancy was longest in high-income countries at 78.0 years, followed by 69.1 years in middle-income and just 58.1 years in low-income regions.",
    "By 2004, population growth had fallen slightly to 1.8 % in low-income and to 0.7 % in high-income countries, while remaining steady at 0.9 % in the middle-income group. Fertility rates dipped to 3.7, 2.1 and 1.7 births per woman in low-, middle- and high-income countries respectively. In contrast, life expectancy rose to 58.8 years in low-income, to 70.0 years in middle-income and to 78.7 years in high-income countries."
  ],
  15: [
    "The given chart illustrates the proportion of household spending on goods and services in a specific nation in the 10-year period, from 1995 to 2005.",
    "Overall, the proportions of spending on housing and transport experienced an upward trend over the examined period, while there was an increase in the percentage of two remaining categories. Additionally, Food and Drinks occupied the largest proportion in 1995, whereas in 2005, the shares of Housing surpassed those of Food and Drinks.",
    "In 1995, households allocated approximately 28% expenditure on housing, which was nearly doubled the figure of transport, at around 15%. In the following years, the share of housing substantially increased by about 6%, reaching around 34% in 2005, making it the biggest expense. Furthermore, the figure for transport followed a similar pattern, which rising from just 15% in 1995 to roughly 19% in the final year.",
    "An opposite trend was recorded in the remaining two categories during the given period. In 1995, people spent about 32% their budgets on Food and Drinks, which was 7% higher than that of Other Goods and Services. Over time, the budget for Food and Drinks witnessed the most significant reduction among the four categories, which decreased to just 24% in the final year, thereby losing its leading position. Meanwhile, the figure for Other Goods and Services was slightly felt to approximately 23% in 2005."
  ],
  16: [
    "The pie charts compare the types of television programs preferred by three age groups ranging from 10 to 25 years old.",
    "Overall, younger viewers tend to favour entertainment-based content such as cartoons and sports, while older viewers increasingly prefer more serious genres, particularly news.",
    "Among those aged 10 to 15, cartoons and sports are equally popular at 26%, making them the top two categories. Drama also attracts a significant audience at 23%, followed by films at 19%, whereas news accounts for only 6% of viewing time, the lowest figure across all groups. For viewers aged 16 to 20, preferences shift noticeably. Drama becomes the most-watched category at 30%, while films rise slightly to 23%. Viewership of news increases to 18%, nearly tripling compared to the youngest group.",
    "In contrast, interest in cartoons and sports declines sharply, falling to 15% and 14% respectively. Among young adults aged 21 to 25, news becomes the dominant category, representing 33% of total viewing. Drama and films remain relatively stable at 22% and 21%, while cartoons continue to decline to 20%. Sports, however, drop dramatically to just 4%, making them the least-watched genre among this group."
  ],
  17: [
    "The line graph illustrates the price changes for 800 grams of four different types of bread—wholegrain, brown, white, and rye—in a European country between 2001 and 2005. Prices are measured in euros.",
    "In general, prices for all bread types except wholegrain increased over the period. Although wholegrain bread was initially the most expensive, brown bread eventually became the priciest. Rye bread consistently remained the least expensive option throughout.",
    "In 2001, wholegrain bread was priced at 0.8 euros, rising sharply to 1.8 euros in 2002. However, its price then dropped dramatically to 0.7 euros in 2004 before returning to 0.8 euros in 2005, the same as at the start.",
    "Meanwhile, rye, white, and brown bread all cost 0.6 euros in 2001. By 2005, the price of white bread had more than doubled to 1.3 euros. Brown bread experienced a rapid increase to 1.5 euros in 2002, followed by some fluctuations, eventually becoming the most expensive at 1.6 euros in 2005. Rye bread's price was relatively stable, fluctuating slightly between 0.5 and 0.7 euros and remaining the cheapest throughout the five years."
  ],
  18: [
    "The diagram below illustrates how many silk factories there were in England and Wales from 1851 to 1901 and how many people worked in those factories over the same period.",
    "Overall, while there was an upward trend in the number of silk mills over the given period, a reverse trend was observed in the total number of employees. It is also noticeable that there were considerably more females than males employed in this industry.",
    "Looking into the statistics, in 1851, there were 130750 people working in 272 factories producing silk. Ten years later, the figure for factory workers suffered a significant decline of more than 20000 individuals, whereas the number of silk-manufacturing plants peaked at 761, almost triple that of the first year. From 1861 to 1901, while the figure for employees continued to drop until it hit a low of just under 39000 at the end of the period, the number of factories fluctuated in the first two decades before slightly decreasing to 623 in the last year.",
    "With regard to male and female workers, in the first year, there were nearly 54000 men and over 76000 women working in silk mills. Over the next 50 years, a steady fall was witnessed in the figures for both male and female staff members. In the final year, these figures hit a low of over 13000 and above 25000 respectively. It is also worth noting that throughout the period shown, the number of female workers was invariably higher than that of male workers by at least 5000 people."
  ],
  19: [
    "The two maps depict a section of a village called Shalton in 1910 and how it looked a century later.",
    "Overall, the most striking transformation was the removal of green spaces and the addition of several commercial and residential areas.",
    "In 1910, this section of the village was bordered by three major roads: School Road to the west, London Road to the east, and High Street to the south, which together formed a triangular layout. At the heart of the village stood a large house surrounded by trees, and directly to its south were a grocer, a small house, and a baker. Several houses were located on High Street, whereas along School Road, there was a school, a butcher, and another house. A post office stood at the corner of School Road and London Road.",
    "By 2010, the most significant change was the disappearance of the large house and its surrounding greenery to make way for a new residential area, accessed via a side road branching off from London Road. The grocer had been converted into a café, while the baker had been removed. A new supermarket with an adjoining parking lot had occupied the area where the butcher once stood. In addition, the house to the north of School Road had been replaced by a bank, while the post office opposite it and the school in the southwest remained unchanged. Meanwhile, a number of houses had been constructed along London Road and High Street."
  ],
  21: [
    "The table shows data on oil production in four African countries from 2000 to 2004.",
    "Overall, apart from Congo, the amount of oil manufactured increased over the period. In addition, the amount of oil produced in Nigeria was disproportionately higher than the oil production levels in the other three countries.",
    "At the beginning of the period, Nigeria produced 2 million tons of oil, around 8 times higher than the figure for Congo's oil production in the same year. Nigeria's production stayed between 1.9 million and 2.3 million tons while Congo's oil quantities fell gradually for the rest of the period. In 2004, oil production in Congo constituted 200 thousand tons, falling to less than 10% of Nigeria's total.",
    "Chad and Somalia had modest amounts of oil production in the first 3 years. While Somalia's total production from 2000 to 2002 was 30 thousand tons, Chad registered no data in the three-year course. Only in the next year did Chad produce 15 thousand tons, which tripled to around 50 thousand tons in 2004. Somalia also increased its oil production to 40 thousand tons in 2003, and then 55 thousand tons in 2004."
  ],
  22: [
    "The maps illustrate significant changes that occurred in the layout of a library's ground floor between 2001 and 2009.",
    "Overall, the library underwent extensive renovations, reflecting a shift towards a more diverse collection, coupled with the inclusion of modern facilities.",
    "In 2001, the library was organized into four main sections: Fiction at the back, History and Self Help to the left, and Newspapers & Periodicals on the right, with tables centrally located for reading and study. The librarian's desk was situated just behind the entrance, adjacent to the stairs.",
    "By 2009, the Fiction and History sections had been reduced in size and relocated closer to the entrance, on the left side of the librarian's desk. At the backmost part of the library, a Children's Books area was introduced, featuring a dedicated space for children's activities. The former History shelf is now used to accommodate Law, Economics and Kitchen books. Notably, the Newspapers & Periodicals section was completely removed and replaced with a Films & DVDs section, situated next to a newly added computer area. Throughout these changes, the original eight tables had been replaced by four longer ones."
  ],
  23: [
    "The line graph illustrates the average time spent by four car manufacturers—General Motors, Ford, Toyota, and Honda—in producing vehicles at their factories in the United States from 1998 to 2005.",
    "Overall, the time required for car production at all four companies showed a downward trend, with Toyota and Honda achieving the lowest production hours by the end of the period. Meanwhile, American manufacturers General Motors and Ford started with higher production times but managed to reduce them significantly.",
    "In 1998, General Motors had the longest production time at approximately 32 hours, followed closely by Ford with around 30 hours. However, both companies saw a steady decline over the period, with Ford experiencing a particularly sharp reduction from 2002 onwards, reaching about 22 hours by 2005. General Motors, while maintaining a consistent drop, ended at slightly above 20 hours.",
    "Toyota and Honda, on the other hand, maintained lower production times throughout. Starting at around 22 hours in 1998, Toyota gradually decreased its hours and eventually reached roughly 19 hours in 2005, the lowest among the four. Honda displayed a similar pattern, reducing its production time from about 21 hours in 1998 to just under 20 hours in 2005."
  ],
  41: [
    "The maps illustrate the development of Brindell from 1800 to 2000, showing the transformation of the area in terms of land usage and urbanization.",
    "Over the period, the region shifted from being primarily agricultural and woodland to being more urbanized with a significant increase in industrialization.",
    "In 1800, Brindell consisted mostly of farmland, with areas designated for both crops and animals. The region was also heavily forested, with large woodlands occupying a considerable portion of the land. A river stour flowed through the area, providing water for the farmland. The town of Brindell itself was located in a small part of the area, with limited development.",
    "By 1900, Brindell had undergone significant changes. The woodland was significantly reduced, and industrial development began to take shape. The farmland dedicated to crops and animals remained, but a new area for industry was established. The \"Bun hill\" area, a village for workers, was also developed to accommodate the growing industrial workforce. The town of Brindell expanded slightly, and the river stour was still a defining feature of the area.",
    "By 2000, Brindell had transformed into a largely urbanized area. The industrial zone had expanded considerably, taking up much of the land previously occupied by woodlands and farmland. The \"Bun hill\" area had also grown and included a park, catering to the needs of the workers and residents. The town of Brindell remained, but the surrounding farmland and woodlands had diminished significantly. The river stour still flowed through the area, but it now served more as a decorative feature in the park rather than a functional resource for agriculture."
  ],
  44: [
    "The diagram illustrates the layout of a solar panel and its use in heating air and water.",
    "In general, there are three main components in the panel, and it features an environmentally friendly design utilizing natural sunlight without requiring extra energy.",
    "To start with, it consists of a rectangular box covered with a transparent top. An inlet is placed on the left-hand side with the outlet on the other side. Furthermore, if the panel is used for heating water, a water pipe is inserted between the inlet and outlet to let the water pass through.",
    "The sun's rays generate heat energy to increase the temperature of the air and water entering the box through the transparent glass. These substances are heated after absorbing the energy. When leaving the box, warm gases and liquid can be acquired. This panel has an environmentally friendly design since it relies on the heat energy generated by the sunlight. No extra energy is needed to heat up the substances."
  ],
  45: [
    "The diagram renders a detailed depiction of the process whereby fresh olives are transformed into edible olive oil.",
    "Overall, raw olives undergo 7 main steps, which involve the role of several special pieces of equipment, to transform into marketable olive oil. It commences with the harvesting of the fruits and culminates in the storage and distribution of the refined oil.",
    "The preliminary stage of olive oil production is characterized by the collection of raw olives from olive trees. Once the raw olives have been amassed, they are washed thoroughly with cold water. This step is imperative to ensure that the olive oil produced at the end is devoid of any dirt and unwanted impurities. Having been rinsed, the olives are then placed onto a conveyor belt to be transferred to a milling chamber where they are crushed. Subsequent to the completion of this step, olive paste and olive stones emerge as the resulting byproducts. While the stones are discarded, the olive paste is then filled into porous bags for further processing.",
    "The ensuing stages see the olive paste inside those bags being converted to marketable olive oil through a series of processes. These bags are first fed into a press to extract liquid from the paste through the use of intense pressure. The holes in these bags allow liquid from the paste to escape, leaving the solid byproduct retained within the bags. Once the liquid has been separated from the solid, it is channeled into a chamber to settle. The culmination of this process is the natural separation of the water from the olive oil, the latter of which is then ready for storage and commercial use."
  ],
  47: [
    "The three illustrations depict the location of a volcano and the transformations of a village before and after a volcanic eruption.",
    "Overall, significant damage occurred to the landscape and the village infrastructure due to the eruption. Key changes include the destruction of land near the volcano, the emergence of lava flows, and the disappearance of certain natural and man-made features.",
    "Before the eruption, the volcano was situated on the western side of the area, with a village comprising multiple huts and palm trees scattered across the land. The village also featured two large lakes near its center, providing natural resources for the inhabitants. The environment appeared lush and orderly, with no signs of disturbance.",
    "After the eruption, lava flows stretched from the volcano down to the nearby areas, damaging the surrounding terrain. Parts of the village near the volcano were completely destroyed, and the lakes appeared to have been partially dried up or altered. Furthermore, many palm trees and huts were either removed or displaced, leaving some sections of the land barren and scorched. Despite these drastic changes, certain portions of the village remained intact, particularly those located farther away from the volcano."
  ],
  48: [
    "Given in the process is how a contemporary household landfill is constructed and operated.",
    "Four stages are involved, starting from creating a space underground and ending at pit covering.",
    "The first two stages aims at constructing the landfill. Firstly, an artificial open rectangle hole is dug until reaching the natural rock layer of the earth core. Several layers including clay and synthetic substances are then used to cover the pit wall. Drainage pipes are placed on the surface of the base except for the minor space spared at the bottom of the pit for a drainage tank.",
    "Once the pit construction is finished, household waste could be stored inside. Users are advised to close it by a clay lid in the final step. While the waste is fermented, the gas produced along the way could pass through the installed pipes and is potentially reused as a form of energy."
  ],
  49: [
    "The bar chart compares the proportions of Australians in six age groups who used the Internet only for online shopping in 2007 and 2009.",
    "Overall, people aged 26-45 recorded the highest percentages of online shoppers in both years, whereas those aged 65 and over consistently accounted for the smallest proportion. In addition, Internet shopping generally became more popular across most age groups over the period.",
    "In 2007, the proportion of Australian people aged 26-45 years old was the highest, with about 32% of 26-35 year olds using the Internet for shopping online, while the data for age group 36-45 years old was about 26%. By contrast, the figures for younger users were noticeably lower, at around 12% for 18-25 age group and 8% for those under 18. The proportion of people aged 46-65 stood at roughly 15%, while only about 5% of individuals aged over 65 shopped online.",
    "By 2009, the percentage of online shoppers had increased in most age groups. The 26-35 and 36-45 cohorts rose to around 38% and 32%, respectively. Similarly, usage among 18-25 year olds climbed to approximately 20%, while the figure for the 46-65 group increased modestly to about 20%. Although Internet shopping among those aged 65 and above also grew, it remained the lowest, at just under 10%."
  ],
  51: [
    "The diagram illustrates the fire escape plan for the second floor of a student dormitory at a college. The plan outlines the layout of the floor, including the locations of bedrooms, emergency exits, and designated assembly points.",
    "Overall, the floor is organised around a central corridor, which provides access to all seven bedrooms. The plan clearly shows two main escape routes leading to two separate meeting points located outside the building. All escape paths are indicated by arrows, directing residents to the nearest safe exit.",
    "On the left side of the floor, Bedrooms 1, 2, and 3 are situated off the main corridor. The escape route from these rooms is a set of stairs located in the bottom-left corner of the floor. The arrows show a clear path from Bedrooms 2 and 3 that leads to staircase. The stairs provide direct access to an outdoor area where Meeting point 1 is located.",
    "In the centre and to the right, Bedrooms 4, 5, 6, and 7 are all connected to the central corridor. The escape route for these rooms is another set of stairs and a lift located in the top-right section of the building. Arrows indicate that residents from these bedrooms should proceed along the corridor towards exit. From this point, the path leads to Meeting point 2. It is also notable that all bedrooms have a clear path of escape, ensuring residents can quickly and safely exit the building in an emergency."
  ],
  52: [
    "The provided line graph compares the rates of Australian female and male workers aged between 18 and 34 in 1976 and 2011.",
    "From an overall perspective, it is readily apparent that the percentage of employed men was significantly higher than that of women in both years, except for the figure for men in 2011 aged under 21 years old. In addition, most male age groups experienced a downward trend throughout the period, and a similar tendency could be seen in women workers, apart from the female age group from under 24 to more than 27 years old.",
    "Concerning male employees, their proportion increased moderately from the youngest to the oldest groups. In 1976, the gap between 22 and 18-year-old group was slightly widened, ranging from around 55 to 66%, respectively. Meanwhile, men between the ages of 23 and under 29 years old were recorded at relatively similar rates, varying from approximately 65 to 69%. The remaining age groups represented relatively high proportions, with figures exceeding 70%. In 2011, the same pattern could be observed in all age groups. While the 18-to-22-year-old group ranged from about 39 to 52%, the next age group, comprising people aged 28 or below, fluctuated between 50 and 52%. Notably, men aged 29 and over accounted for more than half of the entire workforce, from around 56 to 70%.",
    "Regarding female employees, in 1976, the percentage of females in each age group decreased progressively with age. Compared to men, women merely represented less than half of the whole workforce, at under 50%, with the lowest percentage being recorded among 34-year-olds, at only around 30%. In 2011, there were some significant changes in the figures. Age groups between 18 and 23 declined dramatically, varying from 40 to 45%. The oldest group between 28 and 33 years old witnessed a similar trend, decreasing slightly (from around 35 to 30%). Conversely, an increase was seen in age groups from 24 to 27, with values below 45%. Three age groups remaining unchanged were under 24, over 27, and 34 years old, at approximately 43, 37, and 30%, in the given order."
  ],
  53: [
    "The two maps showcase the main changes which took place in a museum between the years 1998 and 2008.",
    "In general, it is apparent that the museum has experienced significant redevelopment, with the introduction of improved amenities and a relocation of key facilities.",
    "In 1998, the museum's layout featured a symmetrical design. Upon entering through the ticket entrance located central-South, visitors could find the Shop adjacent to the toilet and cloakroom to their right and the Temporary Exhibition Room to their left. At the heart of the museum design was a Grand Garden and two identical Permanent Exhibition rooms positioned on the North-East and North-West. A cafe was situated just above the Garden.",
    "By 2008, the museum had been extensively modernized with the introduction of brand-new amenities. Both the ticket entrance/exit, the Garden and Cafe had mostly remained the same, with the exception of the added fountains to the Garden and an adjacent cafe sitting area. The Temporary Exhibition Room was relocated to the West wing, where the previous Permanent exhibition hall was, and the original space was repurposed to accommodate the Shop and Cloakroom. Additionally, a new restaurant had been constructed in the North-West corner. The once-symmetrical permanent exhibition rooms had been modified, with the Western wing demolished, and the Eastern wing expanded, taking over the space previously occupied by the Shop, Toilet and Cloakroom."
  ],
  54: [
    "The pie charts illustrate the percentage of time adults waste during their working day on various tasks in a particular nation between 1958 and 2008.",
    "Overall, the percentage of time spent working and sleeping was the highest in 1958. Additionally, while the time spent on every other activity increased, the percentage spent going out and sleeping declined.",
    "According to the first chart, the percentage of time spent on working and sleeping was similarly the highest, at 33% and 32%, respectively. Going out accounted for 19%, while relaxing at home was 11% less. Furthermore, the total percentage of time spent on other activities, such as playing sports (6%) and traveling to work (2%), was equal to the percentage of time spent relaxing at home (8%).",
    "In the second chart, the working percentage increased significantly to 40%. Meanwhile, the percentage of time spent sleeping decreased by 7%. Moreover, the percentage spent relaxing at home was 5% larger in 2008. The percentage of time spent on other activities was identical to time spent on travel to work, at 8%. Finally, the time spent going out declined to 6% in 2008."
  ],
  55: [
    "The pie charts represent the proportion of total energy consumption from five different sources in the years 1985, 1995, and 2005, with all figures given in percentages.",
    "Overall, it is clear that the figures for gas and natural gas increased, while renewable energy decreased. Of particular note was oil, which witnessed an upward trend by 1995, but then dropped again.",
    "In 1985, the figure for nuclear energy was about 31%, while renewable energy was approximately 27%. The percentages of total energy consumption from Oil were about 25%, whereas gas and nuclear gas trailed behind with around 9% and 8% respectively. By 1995, the figure for nuclear energy dropped to about 25%, compared to renewable energy with around 24%. The percentages of total energy consumption from gas and natural gas increased by 2% each (from 9% to 11%, and from 8% to 10%) respectively, while oil increased to approximately 30%.",
    "Surprisingly, in 2005, the figure for nuclear energy remained stable, while the percentages of total energy consumption from renewable energy and oil decreased to around 18% and 25% respectively. The figure for gas was about 14%, following closely by natural gas with approximately 11%."
  ],
  56: [
    "The given table represents different sectors in which women from a particular European nation held management positions in 2006.",
    "Overall, Hospitality was always the most attractive fields for female leaders while only a small proportion of women in this surveyed country took a management role in manufacturing. In addition, across nearly all areas with the exception of hospitality, the higher the position got, the fewer women employers were in charge of it.",
    "Regarding sectors that were more attractive for women, Hospitality consistently outranked its counterparts with 33.14% employers in managing team being female. Meanwhile, the proportion of Executives and CEOs working in hospitality stayed at almost 20% each. This order of popularity was nearly mirrored by IT with female managers and executives accounting for 16.04% and 12.82%, respectively. Only a negligible share of 6.58% was contributed by female IT CEOs.",
    "Moving to sectors in which female employers were less commonly positioned, 16.39% of Finance managers were female, which nearly reached a parity with that of IT. This percentage beat other managing roles by a wide margin with the figure roughly decreasing by a factor of four when it came to Executives and CEOs. Moving to the least preferred category, only 9% of managers in manufacturing were women while just 1% of them held their position either as Executives or CEOs."
  ],
  57: [
    "The two maps illustrate the architectural evolution of a TV centre over the past decade.",
    "Overall, while several sections underwent transformation, certain amenities remained intact, particularly on the left side of the centre.",
    "A closer look at the maps reveals that the clothing rooms have remained unmodified in the upper-left corner. However, whereas Office 3 was positioned centrally a decade ago, it has now been repurposed into a records room. Adjacent to it, the dress store, studio, customer service room, and makeup room have all remained untouched.",
    "On the lower-left section, the reception area remains unaltered. However, the former canteen has been replaced with Office 1. Meanwhile, Records Room has been relocated to where Office 3 previously stood. On the right-hand side, a significant change is evident in the parking facility, which has been downsized to accommodate a tree-lined zone, adding an element of greenery to the site."
  ],
  58: [
    "While some argue that certain historic structures hold more value and should be carefully preserved, others contend that all old buildings warrant equal attention. In my opinion, there are particular buildings with cultural and community value that deserve prioritization.",
    "There is tremendous value to maintaining buildings with significant historical importance. These structures serve as tangible links to the past, showcasing architectural marvels and preserving ancestral links. For instance, ancient castles and palaces symbolize the grandeur of bygone eras, offering a glimpse into the lives of kings, queens, and nobles. By safeguarding these structures, we ensure that future generations can appreciate and connect with their cultural heritage. These buildings also often showcase the craftsmanship and artistic vision of renowned architects and craftsmen. Take, for example, the iconic Taj Mahal in India, a testament to the exquisite beauty of Mughal architecture. Similarly, Gothic cathedrals, Renaissance villas, and Art Deco skyscrapers are not merely bricks and mortar; they are enduring artistic monuments.",
    "Moreover, preserving certain old buildings can contribute to the flourishing of a given community or locale. Historic town centers, with quaint buildings and cobblestone streets, create a sense of place and give residents a shared heritage to cherish. These spaces foster strong community bonds and attract tourists, boosting local economies through heritage tourism. Further restoration and adaptive reuse of these old buildings can generate local economic opportunities. Repurposing a historic building into a boutique hotel, a museum, or an art gallery not only revitalizes the structure but also stimulates job creation and economic growth. Such projects often attract private investors and public funding, injecting resources into the local economy and enhancing the overall quality of life for residents.",
    "In conclusion, certain structures serve as living testaments to the past, encouraging feelings of identity and pride. Therefore, buildings should be selected that have inherent value and they should be maintained by governments."
  ]
};

// Now let's parse data/recent-writing.js using AST or eval, and update each sample
let bookData = null;
const IELTS = { addBook: (b) => { bookData = b; } };
eval(fileContent);

let updatedCount = 0;
bookData.tests.forEach(t => {
  if (splits[t.n]) {
    const pList = splits[t.n];
    const w = t.writing[0];
    
    // Extract existing word count note if present
    const wcMatch = w.sample.match(/<p class="muted"><small><b>Độ dài:<\/b>\s*([^<]+)<\/small><\/p>/);
    const wc = wcMatch ? wcMatch[1] : `~${pList.join(' ').split(/\s+/).length} words`;
    
    const newSample = pList.map(p => `<p>${p}</p>`).join('\n') + `\n<p class="muted"><small><b>Độ dài:</b> ${wc}</small></p>`;
    w.sample = newSample;
    updatedCount++;
  }
});

console.log('Updated', updatedCount, 'tests in memory.');

// Save updated content back to data/recent-writing.js
const newFileContent = `/* Recent IELTS Writing tests generated from fake_recent_ielts_writing and real exam topics.
   Categorized by Task 1 and Task 2, and by specific question types. */
IELTS.addBook(${JSON.stringify(bookData, null, 2)});
`;

fs.writeFileSync('data/recent-writing.js', newFileContent, 'utf8');
console.log('Successfully written data/recent-writing.js');
