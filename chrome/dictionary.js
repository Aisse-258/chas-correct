/*
Copyright Nikolay Avdeev aka NickKolok aka Николай Авдеев 2015

Всем привет из снежного Воронежа!

This file is part of CHAS-CORRECT.

    CHAS-CORRECT is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CHAS-CORRECT is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CHAS-CORRECT.  If not, see <http://www.gnu.org/licenses/>.

  (Этот файл — часть CHAS-CORRECT.

   CHAS-CORRECT - свободная программа: вы можете перераспространять её и/или
   изменять её на условиях Стандартной общественной лицензии GNU в том виде,
   в каком она была опубликована Фондом свободного программного обеспечения;
   либо версии 3 лицензии, либо (по вашему выбору) любой более поздней
   версии.

   CHAS-CORRECT распространяется в надежде, что она будет полезной,
   но БЕЗО ВСЯКИХ ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА
   или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ. Подробнее см. в Стандартной
   общественной лицензии GNU.

   Вы должны были получить копию Стандартной общественной лицензии GNU
   вместе с этой программой. Если это не так, см.
   <http://www.gnu.org/licenses/>.)
*/
'use strict';

var oldTime = Date.now();

var sya="(?=(?:ся|)(?:[^А-Яа-яЁёA-Za-z]|^|$))";
var ca="[цc]+[ао]";

var orphoWordsToCorrect=[
/*
	["",""],
	["",""],
	["",""],
	["",""],
*/
	["в[-]*следстви[ие]","вследствие"],
	["н[еи]зван+ый","незваный"], // TODO: просклонять
	["д[ие]л+ем+а","дилемма"], // TODO: в префиксы, обработать мм на конце
	["тяку","теку"],
	["на-*глазок","на глазок"],
	["н[еи]-*и[зс]","не из"],
	["имейти","имейте"],
	["как-*правило","как правило"],
	["по-*которой","по которой"],//Да, и такое бывает. TODO: просклонять
	["про-*запас","про запас"],
	["свечь","свеч"],
	["н[ао]-*[ао]б[ао]рот","наоборот"],

	["иметь в-*виду","иметь в виду"],
	["имею в-*виду","имею в виду"],
	["имеем в-*виду","имеем в виду"],
	["имеешь в-*виду","имешь в виду"],
	["имеете в-*виду","имеете в виду"],
	["имеет в-*виду","имеет в виду"],
	["имел в-*виду","имел в виду"],
	["имела в-*виду","имела в виду"],
	["имели в-*виду","имели в виду"],
	["имеешь в-*виду","имешь в виду"], //[Katzen Gott]: вроде всё

	["в-*сч[ёе]т","в счёт"],
	["в-*случае","в случае"],
	["в-*виде","в виде"],
	["в-*порядке","в порядке"],
	["в-*целом","в целом"],
	["в[\\s-]*принц[иеы]п[еи]","в принципе"],
	["в-*смысле","в смысле"],
	["в-*первую","в первую"],
	["в-*о+бщем","в общем"],
	["в[\\s-]*конце[\\s-]*то[\\s-]*концов","в конце-то концов"],
	["в[\\s-]*конце[\\s-]*концов","в конце концов"],
	["конце-*концов","конце концов"],
	["в[\\s-]*том[\\s-]*то[\\s-]*и[\\s-]*дело","в том-то и дело"],
	["во-*скоко","во сколько"],

	["в[\\s-]+кратце","вкратце"],
	["во-время","вовремя"],
	["в[\\s-]+догонку","вдогонку"],
	["во внутрь","вовнутрь"],
	["в расплох","врасплох"],
	["в догонку","вдогонку"],//TODO: почистить
	["в догонку","вдогонку"],
	["во первых","во-первых"],
	["в[\\s-]*част*ности","в частности"],

	["кое[\\s]*где","кое-где"],//TODO: аналоги
	["кое[\\s]*кто","кое-кто"],
	["кое[\\s]*что","кое-что"],
	["кое[\\s]*кого","кое-кого"],
	["кое[\\s]*кому","кое-куда"],//[Katzen Gott]: может быть "кое-к", "кое-г" и "кое-ч" префиксами сделать? А то очень много получается.
	["кое[\\s]*как","кое-как"], //TODO: аналоги

	["по-круче","покруче"],
	["по-надежнее","понадежнее"],
	["по-крупнее","покрупнее"],
	["по-подробнее","поподробнее"],
	["по-лучь*ше","получше"],
	["по[-]больше","побольше"],
	["по-меньше","поменьше"],
	["по-скорее","поскорее"],
	["по-началу","поначалу"],
	["по[\\s-]немногу","понемногу"],
	["по[\\s-]+наслышке","понаслышке"],
	["по[\\s-]+пугай","попугай"],
	["по[\\s-]+тихоньку","потихоньку"],
	["по[\\s-]+быстрей","побыстрей"],
	["по-мимо","помимо"],
	["по-этому","поэтому"],
	["по-ходу","походу"],
	["по возражав","повозражав"],

	["по[\\s]*русски","по-русски"],
	["по[\\s]*аглийски","по-английски"],
	["по[\\s]*английски","по-английски"],//TODO: другие языки
	["по[\\s]*французски","по-французски"],
	["по[\\s]*немецки","по-немецки"],
	["по[\\s]*итальянски","по-итальянски"],
	["по[\\s]*шведски","по-шведски"],
	["по[\\s]*украински","по-украински"],
	["по[\\s]*румынски","по-румынски"],
	["по[\\s]*китайски","по-китайски"],
	["по[\\s]*испански","по-испански"],
	["по[\\s]*деревенски","по-деревенски"],

	["потвоему","по-твоему"],// По твоему мнению
	["по-*мо[ей]му","по-моему"],
	["по\\s*товарищески","по-товарищески"],
	["по\\s*обывательски","по-обывательски"],
	["погеройски","по-геройски"],
	["по женски","по-женски"],
	["п[ао]любому","по-любому"],
	["по[\\s-]*собачь*и","по-собачьи"],

	//То, что никогда не пишется с "по" слитно или дефисно, а только раздельно
	//В основном по+существительное

	["по-сети","по сети"],// Посетить
	["по-*идее","по идее"],
	["по-*сути","по сути"],
	["по-*факту","по факту"],
	["по-*делу","по делу"],
	["по-*поводу","по поводу"],
	["по-*возможности","по возможности"],
	["по-*отдельности","по отдельности"],
	["по-*аналогии","по аналогии"],
	["по-*минимуму","по минимуму"],
	["по-*максимуму","по максимуму"],
	["по-*умолчанию","по умолчанию"],
	["по-*соседству","по соседству"],
	["по-*привычке","по привычке"],
	["по-новой","по новой"],
	["по-*крайней","по крайней"],
	["по-русскому","по русскому"],
	["по-полной","по полной"],
	["по-старинке","по старинке"],
	["по-ходу","походу"],
	["по-*слухам","по слухам"],
	["по-*молодости","по молодости"],
	["по[\\s-]*ди[ао]г[ао]нал[еи]","по диагонали"],
	["по-*порядку","по порядку"],
	["по-*очереди","по очереди"],
	["по-*полочкам","по полочкам"],
	["по-*плечу","по плечу"],
	["по-*возможности","по возможности"],
//	["по-интересному","по интересному"],//По-хорошему?
/*
	["",""],
	["",""],
	["",""],
*/
	["деляться","делятся"], // Но раздЕлЯт(ь)ся
	["пол[\\s-]+кило","полкило"],
	["пол[\- ]часа","полчаса"],
	["пол-*года","полгода"],
	["поллитра","пол-литра"],
	["полэкрана","пол-экрана"],

	["не-*был","не был"],
	["не-*была","не была"],
	["не-*было","не было"],
	["не-были","не были"],// Небыль

	["немогли","не могли"],//TODO: окончания
	["немогу","не могу"],
	["несможешь*","не сможешь"],
	["нехоц+а","не хочется"],
	["нехочу","не хочу"],
	["не-*хуже+","не хуже"],
	["н[еи]знаю","не знаю"],
	["недай","не дай"],
	["незавалялся","не завалялся"],
	["невлезает","не влезает"],
	["недействует","не действует"],
	["н[еи]лежит", "не лежит"],
	["неповеришь","не поверишь"],
	["н[ие]люблю","не люблю"],
	["не-*волнуюсь","не волнуюсь"],
	["не-*подн[ия]лась","не поднялась"],
	["не-*хв[ао]та[еи]т","не хватает"],
	["не-*р[ао]бот[ао][еи]т","не работает"],
	["не-*спеша","не спеша"],
	["не-*совсем","не совсем"], //TODO: почистить
	["не\\s-]*совсем","не совсем"],
	["н[еи]-*надо","не надо"],
	["ни-*черта","ни черта"],
	["не-*зря","не зря"],
	["н[ие][фв]курс[ие]","не в курсе"],
	["не[\\s-]*за[\\s-]*что","не за что"],
	["не[\\s-]*с[\\s-]*кем","не с кем"],
	["не[\\s-]*на[\\s-]*чем","не на чем"],
	["не[\\s-]*может","не может"],
	["не[\\s-]*платим","не платим"],
	["не[\\s-]*платит","не платит"],
	["не[\\s-]*я[\\s-]*же","не я же"],
	["не[\\s-]*при[\\s-]*ч[еёо]м","не при чем"],
	["ни[\\s-]*при[\\s-]*ч[еёо]м","ни при чём"],//Да, это два разных!
	["н[еи][ -]*в[ -]*ко[еи]м случа[еи]","ни в коем случае"],
	["ни[\\s-]*за[\\s-]*что","ни за что"],
	["никчему","ни к чему"],
	["ниразу","ни разу"],
	["ни-*одна","ни одна"],
	["ни-*одной","ни одной"],
	["ни-*одну","ни одну"],
	["ни-*одного","ни одного"],
	["ни-*одним","ни одним"],
	["ни-*одном","ни одном"],
	["ни-*один","ни один"],
	["ни-*одному","ни одному"],
	["на[\\s-]*ед[ие]не","наедине"],
	["не[\\s-]гоже","негоже"],
	["н[еи][\\s-]+ужели","неужели"],
	["не[\\s-]*охото","неохота"], //TODO: почистить
	["не-охота","неохота"],
	["н[еи][\\s-]*мно[жшщ]ь*к[ао]*","немножко"],
	["н[ие][\\s-]*оч[ие]нь","не очень"],


	["кудаж","куда ж"],
	["таже","та же"],
	["тот-*же","тот же"],
	["тем-*же","тем же"],
	["те-*же","те же"],//TODO: допросклонять
	["тех-*же","тех же"],
	["теми-*же","теми же"],
	["того-*же","того же"],
	["всеже","все же"],
	["всёже","всё же"],
	["все-*ж","все ж"],
	["всё-*ж","всё ж"],
	["все[\\s-]*[еи]щ[еёо]","все ещё"],
	["что-*ж","что ж"],
	["это-ж","это ж"], //TODO: почистить
	["это-*ж","это ж"],
	["такойже","такой же"],//TODO: просклонять
	["такогоже","такого же"],
	["такомуже","такому же"],
	["такимже","таким же"],
	["такомже","таком же"],
	["такаяже","такая же"],
	["такуюже","такую же"],
	["такими-*же","такими же"],
	["таких-*же","таких же"],
	["такие-*же","такие же"],
	["чтоже","что же"],
	["тожэ","тоже"],
	["такжэ","также"],
	["какую-*ж","какую ж"],
	["какая-*ж","какая ж"],
	["какой-*ж","какой ж"],


	["надо-*бы","надо бы"],
	["какбы","как бы"],
	["хотя-*бы","хотя бы"],
	["жалбы","жал бы"], //[Katzen Gott]: похоже на опечатку в слове "жалобы". Я бы убрала, но если это реально частая ошибка, то пусть.
	["былобы","было бы"],
	["гдебы","где бы"],
	["вроде-*бы","вроде бы"],
	["выб","вы б"],
	["яб","я б"],
	["лучш[еи][\\s-]*б","лучше б"],

	["что[\\s-]*ле","что ли"],
	["штол[еь]","что ли"],
	["что-*ль","что ль"],//TODO: просклонять
	["чего-*ль","чего ль"],
	["чему-*ль","чему ль"],
	["чуть-*ли","чуть ли"],
	["вря[дт]-*ли","вряд ли"],

	["зачемто","зачем-то"],
	["во+бще-*то","вообще-то"],
	["в[\\s-]*о+бщем[\\s-]*то","в общем-то"],
	["почемуто","почему-то"],
	["какую-*т[уоа]","какую-то"],
	["какайа-*то","какая-то"],
	["чьято","чья-то"],
	["чтото","что-то"],
	["ктото","кто-то"],
	["какойт[ао]","какой-то"],//TODO: допросклонять
	["какомут[ао]","какому-то"],
	["какимт[ао]","каким-то"],
	["какомт[ао]","каком-то"],
	["какогот[ао]","какого-то"],
	["какиет[ао]","какие-то"],
	["какаят[ао]","какая-то"],
	["наконецто","наконец-то"],
	["наконецтаки","наконец-таки"],
	["вс[её]таки","всё-таки"],

	["куда-*как","куда как"],
	["потому-*как","потому как"],
	["так-*как","так как"],
	["так[\\s-]*[чш]т[ао]","так что"],
	["потомучто","потому что"],
	["потому-что","потому что"],
	["п[оа]т[оа]му[\\s-]*[шч]т[оа]","потому что"],

	["где-*угодно","где угодно"],
	["кого-*угодно","кого угодно"],
	["как-*только","как только"],
	["тем-*более","тем более"],
	["рука[\\s-]*об[\\s-]*руку","рука об руку"],
	["до-*свидания","до свидания"],
	["до-*свиданья","до свиданья"],
	["на-лету","на лету"],//налёт не обижать!
	["всего[\\s-]*лишь","всего лишь"],
	["б[еи][сз][\\s-]*п[оа]нят[ие]я","без понятия"],
	["как[\\s-]*н[ие][\\s-]*в[\\s-]*ч[еёо]м[\\s-]*н[еи][\\s-]*бывало","как ни в чем не бывало"],
	["к-*стат[еи]","кстати"],
	["как-*раз","как раз"],
	["дада","да-да"],
	["буд-то","будто"],
	["то-*есть","то есть"],
	["при-*встрече","при встрече"],
	["под-дых","под дых"],
	["на[\\s-]*р[ао]вне","наравне"],
	["до-*свидан[иь]е","до свидания"],
	["с-*кем","с кем"],
	["на[\\s-]тощак","натощак"],
	["подругому","по-другому"],
	["на последок","напоследок"],
	["вс[её]-*время","всё время"],
	["ка[кг]-*бу[дт]то","как будто"],
	["что-бы","чтобы"],// Объединить нельзя, ибо первый символ
	["што-бы","чтобы"],
	["вс[её]-*равно","всё равно"],
	["тобишь","то бишь"],
	["из *за","из-за"], //TODO: почистить
	["из за","из-за"],
	["изза","из-за"],
	["из *под","из-под"],
	["и[зс][- ]*под[- ]*лобья","исподлобья"],
	["и[зс][ -]*д[ао]л[еи]ка","издалека"],
	["докучи","до кучи"],
	["сомной","со мной"],
	["чтоли","что ли"],
	["видители","видите ли"],
	["накого","на кого"],

	["молодеж","молодежь"],
	["помоч","помочь"],
	["о[дт]стричь*","отстричь"],
	["по[дт]стричь*","подстричь"],
	["измениш","изменишь"],
	["ра[сз]буд[еи]шь*","разбудишь"],
	["тысячь","тысяч"],
	["душь","душ"],
	["весчь*","вещь"],
	["п[ао]дреж","подрежь"],//TODO: приставки
	["атрежь*","отрежь"],
	["отреж","отрежь"],
	["надрежь*","надрежь"],
	["слыш","слышь"],
	["дрож","дрожь"],
	["финишь","финиш"],
	["ключь","ключ"],
	["ноч","ночь"],
	["будеть","будет"],
	["делаеть","делает"],
	["менше","меньше"],

	["взятся","взяться"],
	["поменятся","поменяться"],
	["мерится","мериться"],
	["мерятся","меряться"],
	["имется","иметься"],//Поднимется
	["грится","говорится"],
	["учаться","учатся"],//Но обучаться
	["общатся","общаться"],//Приобщатся

	["от[\\s-]*куд[ао]","откуда"],
	["пологай","полагай"],

	["хто","кто"],
	["фсё","всё"],//TODO: допросклонять
	["фсем","всем"],
	["фсех","всех"],

	["юнный","юный"],//не могу в префиксы, есть "юннат"
	["юнного","юного"],//больше 54 000
	["юнному","юному"],//больше 12 000
	["юнным","юным"],//больше 20 700
	["юнном","юном"],//больше 16 000
	["юнная","юная"],//больше 200 000. С женским родом проблема. Есть имя Юнна
	["юнную","юную"],//больше 82 00
	["юнные","юные"],//больше 367 000
	["юнных","юных"],//больше 290 000
	["юнными","юными"],//больше 20 000


/*
	[""+ca,""],
	[""+ca,""],
	[""+ca,""],
	[""+ca,""],
*/
	["мы"+ca,"мыться"],//TODO: приставки. В постфиксы нельзя - слишком коротко
	["найд[её]"+ca,"найдётся"],
	["делае"+ca,"делается"],
	["получи"+ca,"получится"],
	["занят*"+ca,"заняться"],
	["научи"+ca,"научиться"],//"а чем легче научица?", аналогичная ситуация. "Он научица!"  ("Он научится!")
	["пяли"+ca,"пялится"],
	["просну"+ca,"проснуться"],
	["меняю"+ca,"меняются"],
	["работае"+ca,"работается"],
	["каже"+ca,"кажется"],
	["верит"+ca,"верится"],
	["кати"+ca,"катиться"],
	["с[чщ]а[зс]*","сейчас"],
	["станови"+ca,"становится"],
	["валя"+ca,"валяться"],
	["валяю"+ca,"валяются"],
	["оста[её]"+ca,"остаётся"],
	["рытся","рыться"],
	["напится","напиться"],
	["добится","добиться"],
	["режеться","режется"],
	["померять*ся","помериться"],
	["мерять*cя","мериться"],
	["менятся","меняться"],
	["грю","говорю"],//TODO: проспрягать //[Katzen Gott]: грит не трогать — единица измерения зернистости
	["грят","говорят"],

	["сьедал","съедал"],
	["сьедала","съедала"],
	["сьедает","съедает"], // больше 109 000
	["сьедаю","съедаю"], // больше 73 000
	["сьедает","съедает"], // больше 109 000
	["сьедают","съедают"], // больше 36 000
	["сьедят","съедят"], //больше 57 000
	["сьешь","съешь"], //больше 101 000
	["сьедим","съедим"], //больше 20 000
	["сьест","съест"], //больше 97 000
	["сьем","съем"], //больше 300 000, сложность. Может быть проблема со словом "съём"
	["сьесть","съесть"],




	["тыщу","тысячу"],
	["тыщи","тысячи"],
	["тыщ","тысяч"],

//?	["чесслово","честное слово"],
	["ес+-н+о","естественно"],
	["ес+е*с*т*н[оа]","естественно"],
	["со[бп]с+т*н[оа]","собственно"],

	["ч[ёо]","что"],
	["н[ие]ч[ёео]","ничего"],
	["кста","кстати"],
//	["счас","сейчас"],
//	["грит","говорит"],//TODO: добить окончаниями [Katzen Gott]: грит — единица измерения зернистости

	["шо","что"],
	["щь*та+","что"],
	["шт*об","чтоб"],

	["знач","значит"],
	["к[ао]рочь*","короче"],
	["поченить","починить"],
	["приминить","применить"],

	["д[ао]фига","очень много"],//Ибо нефиг!
	["ч[ёое]-*то","что-то"],//TODO: дополнить!

	["как-*нить","как-нибудь"],
	["кто-*нить","кто-нибудь"],//TODO: допросклонять!
	["кого-*нить","кого-нибудь"],
	["кому-*нить","кому-нибудь"],
	["кем-*нить","кем-нибудь"],
	["ком-*нить","ком-нибудь"],
	["что-*нить","что-нибудь"],//TODO: допросклонять!
	["чего-*нить","чего-нибудь"],
	["чему-*нить","чему-нибудь"],
	["чем-*нить","чем-нибудь"],
	["чём-*нить","чём-нибудь"],
	["ч[оё]нить","что-нибудь"],//Как отличить от "чинить", не знаю
	["что[\\s-]*нибу[дт]ь","что-нибудь"],//TODO: просклонять
	["ч[ёое]гонить","чего-нибудь"],
	["ч[еоё]-нить","что-нибудь"],
	["ч[оеё][\\s-]*нибу[дт]ь","что-нибудь"],
	["чему-нить","чему-нибудь"],
	["какую нибудь","какую-нибудь"],//TODO: просклонять
	["какой нибудь","какой-нибудь"],
	["какая нибудь","какая-нибудь"],
	["какого нибудь","какого-нибудь"],
	["каком нибудь","каком-нибудь"],
	["каком-нить","каком-нибудь"],
	["какое-нить","какое-нибудь"],

	["ес[ст]+ес+н[ао]","естественно"],
	["катац+о","кататься"],
	["к[ао]роч[еь]*","короче"],
	["в-*[оа-]+[пб]*ще","вообще"],


//	["пожалста","пожалуйста"],//Объединено
	["скока","сколько"],
	["с[её]дня","сегодня"],
	["тада","тогда"],
	["см[ао]реть","смотреть"],
	["ваще","вообще"],
	["к[ао]нечно","конечно"],
	["к[ао]нешн[оа]","конечно"],
	["щ[ая][сз]*","сейчас"],
	["хошь*","хочешь"],
	["весч","вещь"],

	["канеш","конечно"],
	["бля","эх"],//Ибо сил моих больше нет
	["см[а]+ри","смотри"],
	["кр[еи]ве[тд]к[оа]","креветка"],
	["йа","я"],
	["в[\\s-]*о+[пб]щем","в общем"],
	["тол*ь*к[ао]-*что","только что"],
	["почти-*[чш]то","почти что"],
	["луч[ёе]м","лучом"],
	["н[еи]зна[еи]т","не знает"],
	["севодня","сегодня"],
	["м[оа]л[оа]д[её]ж[еи]","молодёжи"],
	["щ[еи]таю","считаю"],
	["кирпич[её]м","кирпичом"],
	["режит","режет"],
	["вроди","вроде"],
	["ч[иае][вг]о","чего"],
	["движ[её]к","движок"],
	["каждего","каждого"],
	["написанно","написано"],
	["позиционировнаие","позиционирование"],
	["почемы","почему"],
	["можна","можно"],
	["чесно*","честно"],//TODO: честный и т. д., не обидеть чеснок
	["со+твет*ст*вен+о","соответственно"],
	["возмоно","возможно"],
	["от-*тудова","оттуда"],
	["времено","временно"],
	["инное","иное"],//TODO: просклонять, лучше - окончания в кучку
	["граници","границы"],
	["пятници","пятницы"],
	["каждего","каждого"],
	["пр[ие]д[её]ть*ся","придётся"],
	["отве[дт]ь*те","ответьте"],
	["уборщиться","уборщица"],
	["прид[её]ться","придётся"],
	["мужич[ёе]к","мужичок"],
	["однажду","однажды"],

	["секреторя","секретаря"], //секреторные железы
	["секреторю","секретарю"],
	["секретор[её]м","секретарём"],
	["секреторе","секретаре"],

	["бе[сз]толоч","бестолочь"],
	["красивше","красивее"],
	["доевши","доев"],
	["помаги","помоги"],//Помагичить

	["хоч[еи]м","хотим"],//хохочем
	["хотишь","хочешь"],
	["хоч[еи]те","хотите"],
	["хотит","хочет"],
	["хочут","хотят"],
//	["хачу","хочу"], // Хачам обидно!

	["вылазит ","вылезает "],//TODO: аналоги
	["и(?:сч|щ|ш)о","ещё"],
	["е(?:сч|щ|ш)о","ещё"],
	["лучче","лучше"],
	["жизне","жизни"],
	["седишь","сидишь"],
	["к[ао]во","кого"],
	["н[ие]з*ь*зя","нельзя"],
	//["миня","меня"],//Нельзя, речка такая есть! [Katzen Gott] речка с большой буквы должна быть. Так что, наверное, можно
	["апять","опять"],
	["зопиши","запиши"],
	["н[ие][ -]над[ао]","не надо"],
	["наверн[ао]е*","наверное"],

	["етими","этими"],//TODO: просклонять, не обидев йети!
	["етим","этим"],
	["етот","этот"],
	["етому","этому"],
	["етом","этом"],
	["етой","этой"],
	["ен*то","это"], // TODO: тогда уж и другим н* пририсовать
	["ету","эту"],
	["ета","эта"],
	["скуб","скуп"],

	["в-*зад[еи]","сзади"],
	["с-*зад[еи]","сзади"],
	["з-*зад[еи]","сзади"],

	["серебреного","серебряного"],//TODO: просклонять
	["серебреный","серебряный"],
	["серебреному","серебряному"],
	["серебреном","серебряном"],
	["серебреным","серебряным"],
	["серебреной","серебряной"],
	["серебреная","серебряная"],
	["серебреную","серебряную"],
	["серебреные","серебряные"],
	["серебреными","серебряными"],
	["серебреных","серебряных"],

	["сначало","сначала"],
	["еще","ещё"],
	["ее","её"],
	["пороль","пароль"],
	["жжот","жжёт"],
	["молодёж","молодёжь"],
	["полувер","пуловер"],
	["продовца","продавца"],
	["п[оа]д[оа]жди","подожди"],
	["п[ао]жай*лу*й*ст[ао]","пожалуйста"],
//	["безплатно","бесплатно"],

	["староной","стороной"],

	["патаму","потому"],
	["жудко","жутко"],
	["поарать","поорать"],
	["сандали","сандалии"],
	["што","что"],
	["што-*то","что-то"],
	["скочать","скачать"],
//	["отзов(?=(?:ы||а|у|ом|ам|ами))","отзыв"],
	["троль","тролль"],
	["придти","прийти"],

	["ложить","класть"],
//	["я ложу","кладу"],//Подойти к ложу / подойти к кладу
	["ложим","кладём"],
	["ложишь","кладёшь"],
	["ложите","кладёте"],
	["лож[ау]т","кладут"],
	["лож[ие]т","кладёт"],

//	["светой","святой"],//TODO: склонять
	["вкантакте","вконтакте"],
	["ихн(?:ий|его|ему|им|ем|ее|яя|ей|юю|ие|их|ими)","их"],
	["сдесь","здесь"],
	["калеса","колеса"],
	["знач[её]к","значок"],
	["покласть","положить"],
	["ник[ао][гв]о","никого"],
	["каг*да","когда"],
	["п[ао]ч[ие]му","почему"],
	["экспрес*о","эспрессо"],

	["увидить","увидеть"],
	["видете","видите"],
	["видешь","видишь"],
	["видет","видит"],
	["видют","видят"],
	["видем","видим"], //[Katzen Gott]: тут вроде все. Может быть можно как-то их "склеить"?

	["сп[оа]сиб[оа]","спасибо"],
	["п[оа]сиб[оа]","спасибо"],
	["типо","типа"],
	["граммот","грамот"],
	["ключ[её]м","ключом"],
	["нович[ёе]к","новичок"],
	["новечку","новичку"],
	["навичог","новичок"],
	["боч[её]нок","бочонок"],
	["нада","надо"],
	["оч+ень","очень"],
	["экстримал","экстремал"],
	["болкон","балкон"],//TODO: просклонять, не обидев князя Болконского
	["очь*(?!-ч)","очень"],
	["н[ие]разу","ниразу"],
	["завтро","завтра"],
	["пра+льно","правильно"],
	["есле","если"],
	["гаус","Гаусс"],//TODO: просклонять. В префиксы нельзя, ибо c -> сс
	["гаусова","Гауссова"], //?
	["металы","металлы"],//TODO: просклонять, помнить про глагол "метал"
	["пешера","пещера"],
	["можи*т","может"],
	["пыво","пиво"],
	//["толко","только"], // Похоже на разовую опечатку, обсуждаемо
	["адн[ао]значь*н[ао]","однозначно"],
	["одн[ао]значь*но","однозначно"],
	["никаг*да","никогда"],
	["кат[её]нок","котенок"],
	["нек[ао]да","некогда"],
	["щелч[её]к","щелчок"],
	["редов","рядов"],

	["параноя","паранойя"],//TODO: досклонять
	["паранои","паранойи"],
	["параное","паранойе"],
	["параною","паранойю"],
	["параноей","паранойей"],

	["истощенна","истощена"],
	["истощенно","истощено"],
	["истощенны","истощены"],

	["пребь[ёе]т","прибьёт"],//TODO: проспрягать
	["стери","сотри"],
	["подощло","подошло"],
	["молодожённых","молодожён"],//TODO: просклонять
	["амбула","фабула"], // [Katzen Gott]: "фабула" подойдет, но если у кого-то есть версия лучше — welcome.
];

var orphoPrefixToCorrect=[
/*
	["",""],
	["",""],
	["",""],
	["",""],
	["",""],
*/
	["цыфр","цифр"],
	["растоян","расcтоян"], // На растаян (снег)
	["сум+ар+н","суммарн"],
	["бесск[оа]нечь*н","бесконечн"],
	["к[оа]+р+д[ие]н+ат+","координат"],
	["преобрет","приобрет"],
	["и[сз]+толков[ао]н","истолковон"],
	["груп(?!п)","групп"],
	["пр[еи][ао]д[ао]лен","преодолен"],
	["на[ий][\\s-]*мень*[шщ]+","наименьш"],
	["на[ий][\\s-]*боль*[шщ]+","наибольш"],
	["н[еи]+-*[зс]т[еи]рпим","нестерпим"],
	["н[еи]+з*с+[яи]ка","неиссяка"], //неиссекаемый - который нельзя иссечь
	["п[еи]р[еи]с[еи]кае","пересекае"],
	["п[еи]р[еи]с[еи]каю","пересекаю"],
	["пр[еи]-*во[зc]-*н*[еи]*мог","превозмог"],
	["прям[ао][\\s-]*пр[ао]п[ао]рц[еи][ао]наль*н","прямо пропорциональн"],
	["учавств","участв"],

	["выбирут","выберут"],
	["выбиру","выберу"],
	["выбире","выбере"],

	["манет","монет"],//Обманет
	["п[оа]д[оа]ван","падаван"],
	["сонц","солнц"],
	["выстовк","выставк"],
	["ковычь*к","кавычк"],
	["к[оа]выч[еи]к","кавычек"],
	["подчерп","почерп"],//[Katzen Gott]: подчерпнуть и иже с ним.
	["комманд","команд"],
	["тюрм","тюрьм"],

	["корысн","корыстн"],
	["прекрастн","прекрасн"],
	["извесн","известн"],
	["неопастн","неопасн"],
	["безопастн","безопасн"],
	["опастн","опасн"],
	["часн","частн"],
	["спорт*цмен","спортсмен"],

	["продлива","продлева"],
	["продова","продава"],
	["попробыва","попробова"],

	["с[еи]мань*тик","семантик"],
	["н[ао]пр[еия]жен","напряжен"],
	["д[еи][ао]лект","диалект"],
	["совпод","совпад"],
	["сожелен","сожален"],
	["ограничев","ограничив"],
	["помошь*ник","помощник"],
	["предъ*истори","предыстори"],
	["чотк","чётк"],
	["драмот","драмат"],
	["б[ао]р[ао]хл","барахл"],
	["б[ао]р[ао]хол","барахол"],
	["обезпеч","обеспеч"],
	["гаряч","горяч"],

	["подь[ёе]м","подъём"],
	["об[ьъ][её]м","объём"],
	["раз[ьъ][её]м","разъем"],
	["сь[её]м","съём"],

	["х[ао]р[ао]ш","хорош"],
	["опода","опада"],
	["большенств","большинств"],
	["модератер","модератор"],
	["рай*[её]н","район"],
	["п[ао]здр[ао]в","поздрав"],
	["колекц","коллекц"],
	["г[еи]м+[оа]р+о","геморро"],
	["колличеств","количеств"],
	["медлен(?!н)","медленн"],
	["помошь","помощь"],
	["чорт","чёрт"],
	["каридор","коридор"],
	["расчит","рассчит"],
	["карабл","корабл"],
	["отсутсв","отсутств"],
	["здрав*ст*вуй","здравствуй"],
	["неот[ъь]емлим","неотъемлем"],
	["к[оа]м+ентар","комментар"],
	["п[еи]р[еи][оа]дич","периодич"],
	["выйгр","выигр"],
	["встрепин","встрепен"],
	["многомернн","многомерн"],
	["куллер","кулер"],
	["повтар","повтор"],
	["пр[ие]вр[ао]щ","превращ"],
	["возражд","возрожд"],
	["замарач","заморач"],
//	["сь","съ"],//TODO: прочие приставки//Мэри Сью
	["учон","учён"],
	["удиля","уделя"],
	["избера","избира"],
	["координальн","кардинальн"],
	["ёгурт","йогурт"],
	["егурт","йогурт"],
	["презнал","признал"],
/*
	[""+sya,""],
	[""+sya,""],
*/
	["предьяв","предъяв"],
	["держут"+sya,"держат"],
	["получет"+sya,"получит"],
	["неполуч[еи]т"+sya,"не получит"],
	["обидить"+sya,"обидеть"],
	["дерать"+sya,"дирать"],
	["тварит"+sya,"творит"],
	["пересикают"+sya,"пересекают"],

	["перепех","перепих"],
	["уеден","уедин"],
	["извен","извин"],
	["обворач","оборач"],
	["металич","металлич"],

	["бъ","бь"],
	["под(?=ск[ао]льз)","по"],
	["назвает","называет"],//5 шт.  на Баше
	["пичаль","печаль"],
	["пакров","покров"],

	["отдера","отдира"],//TODO: другие приставки
	["придера","придира"],
	["задера","задира"],
	["удера","удира"],

	["по-файлов","пофайлов"],

	["спичич","спичеч"],
	["счелч","щелч"],
	["тысеч","тысяч"],

	["дуел","дуэл"],
	["н[ие]видем","невидим"],

	["сельне","сильне"],
	["б[ие]бл[ие]о","библио"],
	["без*связн","бессвязн"],
	["трол(?!л)","тролл"],
	["ощущене","ощущени"],
	["мендал","миндал"],
	["седелок","сиделок"],
	["седелк","сиделк"],
	["женс*чин","женщин"],
	["из[- ]*под-","из-под "],
	["из[- ]*за-","из-за "],
	["друг-друг","друг друг"],
	["вапрос","вопрос"],
	["спраси","спроси"],

	["ч+[еа]ст*лив","счастлив"],//Числившихся
	["щ+[иеа]ст*лив","счастлив"],
	["с[щч]+[иеа]ст*лив","счастлив"],
	["щ+[иеа]ст","счаст"],

//	["с[чщ]+[иеа]ст","счаст"],//счесть
	["иксплоит","эксплоит"],
	["експлоит","эксплоит"],
	["п[ао]м[ао]г","помог"],

	["обисн","объясн"],
	["мароз","мороз"],
	["парнух","порнух"],
	["еп+он","япон"],
	["беомехан","биомехан"],
	["мабил","мобил"],
	["жистян","жестян"],
	["осиле(?!н)","осили"],
	["успак","успок"],
	["оронгутан","орангутан"],
	["ар[ао]нгутан","орангутан"],
	["матив","мотив"],
	["пильмен","пельмен"],
	["децтв","детств"],
	["ужос","ужас"],
	["кр[еи]ве[тд]к","креветк"], //[Katzen Gott]: "креведко" тоже встречается, или его не трогать?
	["тегров","тигров"],
	["испепил","испепел"],
	["сдрав*ств","здравств"],
	["здраств","здравств"],
	["собутылочник","собутыльник"],
	["обкута","окута"],
	["хлыш","хлыщ"],
	["ево[шн][а-яё]+","его"],
	["каров","коров"],
	["шпоргал","шпаргал"],
	["атракцион","аттракцион"],
	["режис[ёе]р","режиссёр"],
	["соеденин","соединен"],
	["симпотич","симпатич"],
	["девч[её]н","девчон"],
	["мущин","мужчин"],
	["большенств","большинств"],
	["седени(?!он)","сидени"], // Да, есть такая штука - седенион
	["електр","электр"],
	["приемуществ","преимуществ"],
	["оффис","офис"],
	["агенств","агентств"],
	["одн[оа]класник","одноклассник"],
	["однаклассник","одноклассник"],
	["видио","видео"],
	["руск","русск"],
	["сматре","смотре"],
	["расчит","рассчит"],
	["кантакт","контакт"],
	["маструб","мастурб"],

	["серебрянн","серебрян"],
	["правельн","правильн"],
	["свинн","свин"],


	["балон","баллон"],
	["коментар","комментар"],
	["прийд","прид"],
	["раз*сказ","рассказ"],
	["класн","классн"],
	["аргазм","оргазм"],
	["регестрац","регистрац"],
	["куринн","курин"],
	["востанов","восстанов"],
	["дешов","дешёв"],
	["пр[ие]з[ие]ватив","презерватив"],
	["телифон","телефон"],

	["гдето","где-то"],
	["кудато","куда-то"],
	["когото","кого-то"],
	["какомто","каком-то"],

	["расспис","распис"],
	["офицал","официал"],
	["здраств","здравств"],

	["жостк","жестк"],//Жостово
	["примьер","премьер"],

	["правел","правил"],
	["еслиб","если б"],
	["разсве","рассве"],
	["росписани","расписани"],
	["гостинниц","гостиниц"],
	["комерч","коммерч"],
	["би[зс]плат","бесплат"],
	["бальш","больш"],

	["без(?=[кпстфхцчшщ])","бес"],//TODO: раз/роз
	["бес(?=[бвгджзлмр])","без"],
	["раз(?=[кпстфхцчшщ])","рас"],
	["рас(?=[бвгджзлмнр])","раз"],
	["воз(?=[пстфхцчшщ])","вос"],
	["вос(?=[бгджзлмнр])","воз"],
	["через(?=[кпстфхцчшщ])","черес"],
	["черес(?=[бвгджзлмр])","через"],

	["бези","безы"],
//	["безт","бест"],//TODO: доделать
	["не долюбли","недолюбли"],
	["боян","баян"],
	["будующ","будущ"],
	["лутш","лучш"],
	["курсав","курсов"],
	["венчестер","винчестер"],
	["брошур","брошюр"],
	["бе[сз]пелот","беспилот"],
	["вмистим","вместим"],
	["жолуд","жёлуд"],
	["возвро","возвра"],
	["в-*течени[ие]","в течение"],
	["вырощен","выращен"],
	["корект","коррект"],
	["грусн","грустн"],
	["граммот","грамот"],
	["неостановлюсь","не остановлюсь"],
	["неожидал","не ожидал"],
	["неимею","не имею"],
	["пол-(?=[бвгджзкмнпрстфхцчшщ])","пол"],//TODO!
	["третье классник","третьеклассник"],//TODO!
	["организьм","организм"],
	["галав","голов"],
	["ро[сз]сол","рассол"],
	["мылостын","милостын"],
	["сотон","сатан"],
	["школьнец","школьниц"],
	["както","как-то"],
	["во[\\s-]*первых ","во-первых, "],
	["во-вторых ","во-вторых, "],
	["в-треть*их ","в-третьих, "],
	["копрал","капрал"],
	["ленност","леност"],
	["лесничн","лестничн"],
	["опазда","опозда"],
	["сохрон","сохран"],
	["умера","умира"],
	["убера","убира"],
	["собера","собира"],
	["разбера","разбира"],
	["погаловн","поголовн"],
	["пиня","пеня"],
	["иссиня ч[еоё]рн","иссиня-чёрн"],
	["Транс+[еи]льван","Трансильван"],
	["коффе","кофе"],
	["влаз[ие]л","влезал"],
	["свян+","свин"],
	["переборш","переборщ"],
	["бутербот","бутерброд"],
	["ч[ие]хотк","чахотк"],
	["привселюдн","прилюдн"],
	["вздыхн","вздохн"],
	["чательн","тщательн"],
	["малчуган","мальчуган"],
	["не-*многа","немного"],
	["р[ао][зс]д[оа][ёе]т","раздаёт"],
	["р[ие]п[ао]з[ие]т[ао]ри","репозитори"],
	["пр[ие]з[ие]нтац","презентац"],
	["шка[вф]ч[ие]к","шкафчик"],

];

var orphoPostfixToCorrect=[
/*
	["",""],
	["",""],
	["",""],
	["",""],
	["",""],
	["",""],
	["",""],
	["",""],
	["",""],
*/
	["мно[жш]ь*те","множьте"],
	["будте","будьте"],

	["сушняч[её]к","сушнячок"],
	["пауч[её]к","паучок"],

	["прячся","прячься"],
	["расслабся","расслабься"],
	["знакомся","знакомься"],
	["ругалсо","ругался"],


	["т[еи]ря[еи]шь*","теряешь"],
	["пиш[иы]шь*","пишешь"],
	["пил[еи]шь*","пилишь"],
	["кин[еи]шь*","кинешь"],
	["найд[её]шь*","найдёшь"],
	["ходиш","ходишь"],
	["помниш","помнишь"],
	["г[ао]в[ао]риш","говоришь"],
	["гл[аея]диш","глядишь"],
	["смотр[ие]ш","смотришь"],
	["будеш","будешь"],
	["хочеш","хочешь"],
	["можеш","можешь"],

/*
	[""+ca,""],
	[""+ca,""],
	[""+ca,""],
	[""+ca,""],
	[""+ca,""],
	[""+ca,""],
*/

	["дра"+ca,"драться"],
	["любова"+ca,"любоваться"],
	["знакоми"+ca,"знакомиться"],// что делать, если фраза будет "он с ней знакомица" (знакомится)?
	["мая"+ca,"маяться"],
	["сыпае"+ca,"сыпается"],
	["рву"+ca,"рвутся"],
	["крыва"+ca,"крываться"],
	["крывае"+ca,"крывается"],
	["крывае"+ca,"крывается"],
	["нрави"+ca,"нравится"],
	["включае"+ca,"включается"],
	["выключае"+ca,"выключается"],
	["вырубае"+ca,"вырубается"],
	["хоче"+ca,"хочется"],
	["зывае"+ca,"зывается"],
	["трахаю"+ca,"трахаются"],
	["мая"+ca,"маяться"],
	["включае"+ca,"включается"],
	["заведу"+ca,"заведутся"],
	["краду"+ca,"крадутся"],
	["траха"+ca,"трахаться"],

	["держиться","держится"],
	["становяться","становятся"],
	["бер[её]ться","берётся"],
	["кажеться","кажется"],
	["кажуться","кажутся"],
	["носяться","носятся"],
	["несуться","несутся"],
	["казываеться","казывается"],
	["прягатся","прягаться"],
	["глядется","глядеться"],
	["удивлятся","удивляться"],
	["обращаеться","обращается"],
	["обращатся","обращаться"],
	["обновяться","обновятся"],
	["обновлятся","обновляться"],
	["пишуться","пишутся"],
	["постяться","постятся"],
	["ходяться","ходятся"],
	["бражатся","бражаться"],
	["цеплятся","цепляться"],
	["вращатся","вращаться"],
	["видиться","видеться"],
	["станеться","станется"],
	["стануться","станутся"],
	["боротся","бороться"],
	["смотриться","смотрится"],
	["стремяться","стремятся"],
	["глашатся","глашаться"],
	["ниметься","нимется"],
	["дасться","дастся"],
	["йдуться","йдутся"],
	["надеятся","надеяться"],
	["гадатся","гадаться"],
	["печататся","печататься"],
	["б[еи]руть*ся","берутся"],
	["готовяться","готовятся"],
	["боиться","боится"],
	["думатся","думаться"],
	["мчиться","мчится"],
	["обидется","обидеться"],
	["ждатся","ждаться"],
	["маятся","маяться"],
	["мытся","мыться"],
	["рватся","рваться"],
	["тиратся","тираться"],
	["кусатся","кусаться"],
	["диратся","дираться"],
	["ниматся","ниматься"],
	["ложаться","ложатся"],
	["нравяться","нравятся"],
	["смеятся","смеяться"],
	["сядеться","сядется"],
	["гулятся","гуляться"],
	["жаловатся","жаловаться"],
	["пытатся","пытаться"],
	["оватся","оваться"],
	["з[ао]бот[яю]ть*ся","заботятся"],
	["б[ие]ратся","бираться"],
	["плавяться","плавятся"],
	["деруться","дерутся"],
	["хвастатся","хвастаться"],
	["вертиться","вертится"],
	["одется","одеться"],
	["грется","греться"],
	["еватся","еваться"],
	["ыватся","ываться"],
	["зыватся","зываться"],
	["врубатся","врубаться"],
	["гружатся","гружаться"],
	["пользоватся","пользоваться"],
	["стебатся","стебаться"],
	["иватся","иваться"],
	["писатся","писаться"],
	["двигатся","двигаться"],
	["колотся","колоться"],
	["являтся","являться"],
	["режуться","режутся"],
	["встречатся","встречатся"],
	["братся","браться"],
	["начинатся","начинаться"],
	["трахатся","трахаться"],
	["занятся","заняться"],
	["кажеться","кажется"],
	["хочеться","хочется"],
	["просяться","просятся"],
	["к[оа]зать*ся","казаться"],
	["глядывац+[ао]","глядываться"],
	["играц+[оа]","играться"],
	["пишеться","пишется"],
	["читаец+а","читается"],
	["пользуюца","пользуются"],
	["пытаюц+а","пытаются"],
	["ругаец+о","ругается"],
	["явяться","явятся"],
	["пускаюц+а","пускаются"],
	["борятся","борются"],
	["сыпится","сыпется"],
	["сыпатся","сыпаться"],
	["рвуться","рвутся"],
	["рвуться","рвутся"],
	["пользуеться","пользуется"],
	["кочаеть*ся","качается"],


	["ються","ются"],
	["ёться","ётся"],
	["аеться","ается"],
	["оеться","оется"],
	["уеться","уется"],
	["яеться","яется"],
	["ееться","еется"],
	["юеться","юется"],

	[" ка","-ка"],
	["видил(?=а|и|о|)(?=с[яь])","видел"],
	["батареик","батареек"],
	["товарищь","товарищ"],
	["откудо","откуда"],

	["-ли"," ли"],
	["-же"," же"],
	["-бы"," бы"],

//	["-что"," что"],//кое-что

	["аеш","аешь"],
	["шся","шься"],
	["изьм","изм"],//TODO: просклонять
	["цыя","ция"],//TODO: просклонять
	["кочать","качать"],//TODO: проспрягать
	["пожж[еа]","позже"],
	["кочает","качает"],
	["алася","алась"],
	["шол","шёл"],

	["смотрем","смотрим"],//TODO: допроспрягать. И вообще все глаголы-исключения
	["стелим","стелем"],
	["бреим","бреем"],
	["дышем","дышим"],
	["видем","видим"],

	["щ[еёо]лк[ао][еи]т","щёлкает"],
	["садют","садят"],
	["следующию","следующую"],
	["убъю","убью"],
	["девушко","девушка"],
	["хранилищь","хранилищ"],
	["выгонет","выгонит"],
	["глядет","глядит"],
	["давным\\s*давно","давным-давно"],
	["в-*курсе","в курсе"],
	["\\s*-*\\s+на-*все[вг][оа]","-навсего"],
	["\\s*-*\\s+н[ие]бу[дт]ь","-нибудь"],
	["видить","видеть"],
	["-нть","-нибудь"],
	["н[ие]буть","нибудь"],
	["беременяю","беременею"],

	["терад","тирад"],
	["цыми","цами"],
];

var orphoFragmentsToCorrect=[
/*
	["",""],
	["",""],
*/
	["значте","значьте"], //TODO: Разобраться, почему во фрагментах.

	["м[ао]т+[ие]р+[ие]й*[ая]л","материал"],
	["п[ао]р[ао]л+[еи]л+[ао]грам","параллелограм"],
	["л[ао]г[ао]рифм","логарифм"],
	["р[еи]с+т[ао]ран","ресторан"],
	["инжинер","инженер"],
	["товарисч","товарищ"],
	["шампинь[её]н","шампиньон"],
	["бутербр*о[тд]","бутерброд"],
	["су[еи]ц[иы]д","суицид"],
	["матер[еи]ял","материал"],
	["елемент","элемент"],
	["пр[ие]з[ие]дент","президент"],
	["тренажор","тренажёр"],
	["в[ао]л+[еи]й*бол","волейбол"],
	["фу[дт]+бол+","футбол"], // TODO: другие аналогичные виды спорта
	["адресс","адрес"],
	["ньюанс","нюанс"],
	["ат+р[ие]бут","атрибут"],
	["парашут","парашют"],
	["циллиндр","цилиндр"],
	["маштаб","масштаб"],
	["пр[оа]т+[оа]тип","прототип"],
	["[оа]р[еи]нтир","орентир"],
	["компромитир","компрометир"], //компрометировать
	["инсцинир","инсценир"],
	["зачот","зачёт"],
	["тендор","тендер"],
	["субьект","субъект"],
	["обьект","объект"],
	["проэкт","проект"],
	["бытерброд","бутерброд"],
	["cочельнтик","cочельник"],
	["водоконал","водоканал"],// не могу поставить отдельно ["конал", "канал"]. Есть названия фирмы "конал" и "Конал" - имя ирландского героя

	["искуств","искусств"],
	["естесств","естеств"],
	["чуств","чувств"],

	["ьезд","ъезд"],
	["ьезж","ъезж"],
	["ьявл","ъявл"],

	["с[ие]р[ьъ][её]з","серьёз"],
	["обезъян","обезьян"],
	["парал+ел+(?!л)","параллел"],
	["распрострон","распростран"],
	["съ*о+риентир","сориентир"],
	["пермонент","перманент"],
	["миллиц","милиц"],
	["расствор","раствор"],
	["балотир","баллотир"],
	["интерис","интерес"],
	["тринир","тренир"],
	["пологают","полагают"],
	["пологай","полагай"],
	["варачива","ворачива"],
//];[

	["топчит"+sya,"топчет"],//sya уже включает границу слова
	["пологаеть*"+sya,"полагает"],
//	["видит"+sya,"видеть"],//Бред
	["видет"+sya,"видит"],
	["клеет"+sya,"клеит"],
	["клеют"+sya,"клеят"],
	["пялет"+sya,"пялит"],
	["тащет"+sya,"тащит"],
	["бъёт"+sya,"бьёт"],
	["смотрет"+sya,"смотрит"],
	["тр[еия]с[ёе]т"+sya,"трясёт"],//TODO: проспрягать
	["хочит"+sya,"хочет"],

	["щитин","щетин"],
	["разет","розет"],
	["если-*чо","если что"],
	["сикунд","секунд"],
	["лучьш","лучш"],
	["ч[ие]л[оа]в*[еэ]к","человек"],
	["совецк","советск"],
	["инстал(?![лл])","инсталл"],

	["ньч","нч"],
	["ньщ","нщ"],
	["чьн","чн"],
	["щьн","щн"],
	["чьк","чк"],
	["ъи","ы"],
	["ъэ","э"],

	["будующ","будущ"],
	["следущ","следующ"],
	["празн","праздн"],
	["цыкл","цикл"],
	["мед[еи]ц[иы]н","медицин"],

	["интерестн","интересн"],
	["класн","классн"],
	["учасн","участн"],

	["эксплуот","эксплуоат"],
	["принцып","принцип"],
	["мыслем","мыслим"],
	["престег","пристег"],
	["престёг","пристёг"],
	["фармат","формат"],
	["ьедин","ъедин"],
//	["ьед[еи]н","ъедин"],//Объедение
//	["ъед[еи]н","ъедин"],
	["проблемм","проблем"],
	["пропоган","пропаган"],
	["коблук","каблук"],
	["брительк","бретельк"],
	["буит","будет"],
	["хотяб","хотя б"],
	["регестр","регистр"],//Или "реестр", но сочтём это санкциями
	["рецедив","рецидив"],
	["оч[еи]рова","очарова"],
	["ьясн","ъясн"],
	["чорн","чёрн"],
	["авторезир","авторизир"],
	["ил*[еи]м*[еи]нт","элемент"],
	["эл*[еи]м*[еи]нт","элемент"],//TODO: дебажить до "[эи]л*[еи]м*[еи]нт"
	["пробыва","пробова"],
	["глядав","глядыв"],
	["р[еи]к[ао]ш[еи]т","рикошет"],
	["м[ие]н[ие]рал","минерал"],

];

var matyuki=[
];

var yo=[
];

try{
	module.exports.orphoWordsToCorrect     = orphoWordsToCorrect;
	module.exports.orphoPrefixToCorrect    = orphoPrefixToCorrect;
	module.exports.orphoPostfixToCorrect   = orphoPostfixToCorrect;
	module.exports.orphoFragmentsToCorrect = orphoFragmentsToCorrect;
}catch(e){
	//Значит, не node.js
}
