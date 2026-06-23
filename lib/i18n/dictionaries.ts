import type { Locale } from "./config";

/**
 * UI string dictionaries, one per locale. Keys are flat dotted strings. Catalog
 * data (movie titles, synopses, cast, genres) comes from TMDB and is not
 * translated here; only the app's own wording is. The brand name "StreaMatrix"
 * is intentionally never translated.
 *
 * `en` defines the shape; every other locale must provide the same keys (the
 * `satisfies` check below enforces this at build time).
 */

const en = {
  "nav.browse": "Browse",
  "nav.genres": "Genres",
  "nav.menu": "Menu",
  "nav.close": "Close menu",
  "header.toggleMenu": "Toggle menu",
  "header.home": "home",

  "nav.trending": "Trending Now",
  "nav.hollywood": "Hollywood",
  "nav.series": "Television Series",
  "nav.animated": "Animated",

  "rail.trending": "🔥 Trending Now",
  "rail.movies": "Hollywood",
  "rail.animated": "Animated",
  "rail.series": "Television Series",
  "rail.acclaimed": "Critically Acclaimed",
  "rail.sci-fi": "Sci-Fi & Beyond",
  "rail.action": "Action & Adventure",
  "rail.thriller": "Edge of Your Seat",
  "rail.documentary": "Documentaries",
  "rail.comedy": "Comedies",
  "rail.drama": "Drama",

  "cat.Action": "Action",
  "cat.Sci-Fi": "Sci-Fi",
  "cat.Drama": "Drama",
  "cat.Comedy": "Comedy",
  "cat.Documentary": "Documentary",
  "cat.Thriller": "Thriller",
  "cat.Animation": "Animation",

  "search.placeholder": "Search movies, series, genres…",
  "search.aria": "Search titles",
  "search.clear": "Clear search",

  "filter.by": "Filter by",
  "filter.category": "Category",
  "filter.genre": "Genre",
  "filter.year": "Year",
  "filter.all": "All",
  "filter.movies": "Movies",
  "filter.series": "Series",
  "filter.animated": "Animated",
  "filter.clear": "Clear filters",

  "results.for": "Results for",
  "browse.title": "Browse",
  "count.one": "title",
  "count.many": "titles",

  "empty.title": "No titles found",
  "empty.nothingMatches": "Nothing matches",
  "empty.tryDifferent": "Try a different search or category.",

  "continue.heading": "Continue watching",
  "continue.watched": "watched",
  "continue.remove": "Remove from Continue watching",

  "detail.back": "Back to browse",
  "detail.cast": "Cast",
  "detail.castLabel": "Cast:",
  "detail.moreLikeThis": "More like this",

  "title.play": "Play now",
  "title.moreInfo": "More info",
  "hero.featured": "Featured",

  "backToTop": "Back to top",

  "player.loadingStream": "Loading stream…",
  "player.loadingTrailer": "Loading trailer…",
  "player.streamErrorTitle": "This stream couldn’t be played",
  "player.streamErrorBody": "The video source may be temporarily unavailable.",
  "player.trailerErrorTitle": "This trailer couldn’t be played",
  "player.trailerErrorBody": "The trailer may be unavailable in your region.",
  "player.tryAgain": "Try again",

  "footer.tagline": "Your next favorite movie or series — just a search away.",
  "footer.about":
    "StreaMatrix is a modern streaming platform that brings movies, series, and animation together in one place — browse by category, genre, or year and start watching in seconds.",
  "footer.more": "More",
  "footer.builtBy": "Built by",
  "footer.copyright": "Stream more, search less.",

  "lang.select": "Select language",

  "subscribe.promoTitle": "Go Premium",
  "subscribe.pitch": "Unlock 4K, no ads & more.",
  "subscribe.cta": "Get subscription now",
} as const;

export type MessageKey = keyof typeof en;
type Dictionary = Record<MessageKey, string>;

const ar: Dictionary = {
  "nav.browse": "تصفح",
  "nav.genres": "الأنواع",
  "nav.menu": "القائمة",
  "nav.close": "إغلاق القائمة",
  "header.toggleMenu": "تبديل القائمة",
  "header.home": "الرئيسية",

  "nav.trending": "الرائج الآن",
  "nav.hollywood": "هوليوود",
  "nav.series": "المسلسلات التلفزيونية",
  "nav.animated": "الرسوم المتحركة",

  "rail.trending": "🔥 الرائج الآن",
  "rail.movies": "هوليوود",
  "rail.animated": "الرسوم المتحركة",
  "rail.series": "المسلسلات التلفزيونية",
  "rail.acclaimed": "نالت استحسان النقاد",
  "rail.sci-fi": "الخيال العلمي وأبعد",
  "rail.action": "الأكشن والمغامرة",
  "rail.thriller": "على حافة المقعد",
  "rail.documentary": "الأفلام الوثائقية",
  "rail.comedy": "الكوميديا",
  "rail.drama": "دراما",

  "cat.Action": "أكشن",
  "cat.Sci-Fi": "خيال علمي",
  "cat.Drama": "دراما",
  "cat.Comedy": "كوميديا",
  "cat.Documentary": "وثائقي",
  "cat.Thriller": "إثارة",
  "cat.Animation": "رسوم متحركة",

  "search.placeholder": "ابحث عن الأفلام والمسلسلات والأنواع…",
  "search.aria": "البحث عن العناوين",
  "search.clear": "مسح البحث",

  "filter.by": "تصفية حسب",
  "filter.category": "الفئة",
  "filter.genre": "النوع",
  "filter.year": "السنة",
  "filter.all": "الكل",
  "filter.movies": "أفلام",
  "filter.series": "مسلسلات",
  "filter.animated": "رسوم متحركة",
  "filter.clear": "مسح عوامل التصفية",

  "results.for": "نتائج البحث عن",
  "browse.title": "تصفح",
  "count.one": "عنوان",
  "count.many": "عنوان",

  "empty.title": "لا توجد عناوين",
  "empty.nothingMatches": "لا يوجد ما يطابق",
  "empty.tryDifferent": "جرّب بحثًا أو فئة مختلفة.",

  "continue.heading": "متابعة المشاهدة",
  "continue.watched": "تمت مشاهدته",
  "continue.remove": "إزالة من متابعة المشاهدة",

  "detail.back": "العودة إلى التصفح",
  "detail.cast": "طاقم العمل",
  "detail.castLabel": "طاقم العمل:",
  "detail.moreLikeThis": "المزيد من هذا القبيل",

  "title.play": "شغّل الآن",
  "title.moreInfo": "مزيد من المعلومات",
  "hero.featured": "مميز",

  "backToTop": "العودة إلى الأعلى",

  "player.loadingStream": "جارٍ تحميل البث…",
  "player.loadingTrailer": "جارٍ تحميل المقطع الدعائي…",
  "player.streamErrorTitle": "تعذّر تشغيل هذا البث",
  "player.streamErrorBody": "قد يكون مصدر الفيديو غير متاح مؤقتًا.",
  "player.trailerErrorTitle": "تعذّر تشغيل هذا المقطع الدعائي",
  "player.trailerErrorBody": "قد يكون المقطع الدعائي غير متاح في منطقتك.",
  "player.tryAgain": "حاول مرة أخرى",

  "footer.tagline": "فيلمك أو مسلسلك المفضل القادم — على بُعد بحث واحد.",
  "footer.about":
    "ستريماتريكس منصة بث حديثة تجمع الأفلام والمسلسلات والرسوم المتحركة في مكان واحد — تصفّح حسب الفئة أو النوع أو السنة وابدأ المشاهدة في ثوانٍ.",
  "footer.more": "المزيد",
  "footer.builtBy": "بُني بواسطة",
  "footer.copyright": "شاهد أكثر، وابحث أقل.",

  "lang.select": "اختر اللغة",

  "subscribe.promoTitle": "اشترك في بريميوم",
  "subscribe.pitch": "افتح جودة 4K بدون إعلانات والمزيد.",
  "subscribe.cta": "احصل على الاشتراك الآن",
};

const fr: Dictionary = {
  "nav.browse": "Parcourir",
  "nav.genres": "Genres",
  "nav.menu": "Menu",
  "nav.close": "Fermer le menu",
  "header.toggleMenu": "Basculer le menu",
  "header.home": "accueil",

  "nav.trending": "Tendances",
  "nav.hollywood": "Hollywood",
  "nav.series": "Séries télévisées",
  "nav.animated": "Animation",

  "rail.trending": "🔥 Tendances",
  "rail.movies": "Hollywood",
  "rail.animated": "Animation",
  "rail.series": "Séries télévisées",
  "rail.acclaimed": "Acclamés par la critique",
  "rail.sci-fi": "Science-fiction et au-delà",
  "rail.action": "Action et aventure",
  "rail.thriller": "À couper le souffle",
  "rail.documentary": "Documentaires",
  "rail.comedy": "Comédies",
  "rail.drama": "Drame",

  "cat.Action": "Action",
  "cat.Sci-Fi": "Science-fiction",
  "cat.Drama": "Drame",
  "cat.Comedy": "Comédie",
  "cat.Documentary": "Documentaire",
  "cat.Thriller": "Thriller",
  "cat.Animation": "Animation",

  "search.placeholder": "Rechercher films, séries, genres…",
  "search.aria": "Rechercher des titres",
  "search.clear": "Effacer la recherche",

  "filter.by": "Filtrer par",
  "filter.category": "Catégorie",
  "filter.genre": "Genre",
  "filter.year": "Année",
  "filter.all": "Tous",
  "filter.movies": "Films",
  "filter.series": "Séries",
  "filter.animated": "Animation",
  "filter.clear": "Effacer les filtres",

  "results.for": "Résultats pour",
  "browse.title": "Parcourir",
  "count.one": "titre",
  "count.many": "titres",

  "empty.title": "Aucun titre trouvé",
  "empty.nothingMatches": "Aucun résultat pour",
  "empty.tryDifferent": "Essayez une autre recherche ou catégorie.",

  "continue.heading": "Reprendre la lecture",
  "continue.watched": "regardé",
  "continue.remove": "Retirer de Reprendre la lecture",

  "detail.back": "Retour à la navigation",
  "detail.cast": "Distribution",
  "detail.castLabel": "Distribution :",
  "detail.moreLikeThis": "À voir également",

  "title.play": "Lire",
  "title.moreInfo": "Plus d’infos",
  "hero.featured": "À la une",

  "backToTop": "Retour en haut",

  "player.loadingStream": "Chargement du flux…",
  "player.loadingTrailer": "Chargement de la bande-annonce…",
  "player.streamErrorTitle": "Impossible de lire ce flux",
  "player.streamErrorBody": "La source vidéo est peut-être temporairement indisponible.",
  "player.trailerErrorTitle": "Impossible de lire cette bande-annonce",
  "player.trailerErrorBody": "La bande-annonce est peut-être indisponible dans votre région.",
  "player.tryAgain": "Réessayer",

  "footer.tagline": "Votre prochain film ou série préféré — à une recherche près.",
  "footer.about":
    "StreaMatrix est une plateforme de streaming moderne qui réunit films, séries et animation au même endroit — parcourez par catégorie, genre ou année et lancez la lecture en quelques secondes.",
  "footer.more": "Plus",
  "footer.builtBy": "Conçu par",
  "footer.copyright": "Regardez plus, cherchez moins.",

  "lang.select": "Choisir la langue",

  "subscribe.promoTitle": "Passez à Premium",
  "subscribe.pitch": "Débloquez la 4K, sans pub et plus.",
  "subscribe.cta": "Obtenir un abonnement",
};

const ur: Dictionary = {
  "nav.browse": "براؤز کریں",
  "nav.genres": "اصناف",
  "nav.menu": "مینو",
  "nav.close": "مینو بند کریں",
  "header.toggleMenu": "مینو ٹوگل کریں",
  "header.home": "ہوم",

  "nav.trending": "ٹرینڈنگ",
  "nav.hollywood": "ہالی وڈ",
  "nav.series": "ٹیلی ویژن سیریز",
  "nav.animated": "اینیمیٹڈ",

  "rail.trending": "🔥 ٹرینڈنگ",
  "rail.movies": "ہالی وڈ",
  "rail.animated": "اینیمیٹڈ",
  "rail.series": "ٹیلی ویژن سیریز",
  "rail.acclaimed": "تنقیدی پذیرائی یافتہ",
  "rail.sci-fi": "سائنس فکشن اور اس سے آگے",
  "rail.action": "ایکشن اور ایڈونچر",
  "rail.thriller": "سانس روک دینے والے",
  "rail.documentary": "دستاویزی فلمیں",
  "rail.comedy": "کامیڈی",
  "rail.drama": "ڈرامہ",

  "cat.Action": "ایکشن",
  "cat.Sci-Fi": "سائنس فکشن",
  "cat.Drama": "ڈرامہ",
  "cat.Comedy": "کامیڈی",
  "cat.Documentary": "دستاویزی",
  "cat.Thriller": "تھرلر",
  "cat.Animation": "اینیمیشن",

  "search.placeholder": "فلمیں، سیریز، اصناف تلاش کریں…",
  "search.aria": "عنوانات تلاش کریں",
  "search.clear": "تلاش صاف کریں",

  "filter.by": "فلٹر کریں بلحاظ",
  "filter.category": "زمرہ",
  "filter.genre": "صنف",
  "filter.year": "سال",
  "filter.all": "تمام",
  "filter.movies": "فلمیں",
  "filter.series": "سیریز",
  "filter.animated": "اینیمیٹڈ",
  "filter.clear": "فلٹرز صاف کریں",

  "results.for": "نتائج برائے",
  "browse.title": "براؤز کریں",
  "count.one": "عنوان",
  "count.many": "عنوانات",

  "empty.title": "کوئی عنوان نہیں ملا",
  "empty.nothingMatches": "کچھ نہیں ملا",
  "empty.tryDifferent": "کوئی اور تلاش یا زمرہ آزمائیں۔",

  "continue.heading": "دیکھنا جاری رکھیں",
  "continue.watched": "دیکھا گیا",
  "continue.remove": "دیکھنا جاری رکھیں سے ہٹائیں",

  "detail.back": "براؤز پر واپس جائیں",
  "detail.cast": "کاسٹ",
  "detail.castLabel": "کاسٹ:",
  "detail.moreLikeThis": "ملتے جلتے مزید",

  "title.play": "ابھی چلائیں",
  "title.moreInfo": "مزید معلومات",
  "hero.featured": "نمایاں",

  "backToTop": "اوپر جائیں",

  "player.loadingStream": "اسٹریم لوڈ ہو رہی ہے…",
  "player.loadingTrailer": "ٹریلر لوڈ ہو رہا ہے…",
  "player.streamErrorTitle": "یہ اسٹریم نہیں چل سکی",
  "player.streamErrorBody": "ویڈیو ذریعہ عارضی طور پر دستیاب نہیں ہو سکتا۔",
  "player.trailerErrorTitle": "یہ ٹریلر نہیں چل سکا",
  "player.trailerErrorBody": "ٹریلر آپ کے علاقے میں دستیاب نہیں ہو سکتا۔",
  "player.tryAgain": "دوبارہ کوشش کریں",

  "footer.tagline": "آپ کی اگلی پسندیدہ فلم یا سیریز — بس ایک تلاش کے فاصلے پر۔",
  "footer.about":
    "اسٹریامیٹرکس ایک جدید اسٹریمنگ پلیٹ فارم ہے جو فلموں، سیریز اور اینیمیشن کو ایک جگہ یکجا کرتا ہے — زمرہ، صنف یا سال کے حساب سے براؤز کریں اور سیکنڈوں میں دیکھنا شروع کریں۔",
  "footer.more": "مزید",
  "footer.builtBy": "تخلیق کردہ",
  "footer.copyright": "زیادہ دیکھیں، کم تلاش کریں۔",

  "lang.select": "زبان منتخب کریں",

  "subscribe.promoTitle": "پریمیم حاصل کریں",
  "subscribe.pitch": "4K، بغیر اشتہار اور مزید حاصل کریں۔",
  "subscribe.cta": "ابھی سبسکرپشن حاصل کریں",
};

const zh: Dictionary = {
  "nav.browse": "浏览",
  "nav.genres": "类型",
  "nav.menu": "菜单",
  "nav.close": "关闭菜单",
  "header.toggleMenu": "切换菜单",
  "header.home": "首页",

  "nav.trending": "正在流行",
  "nav.hollywood": "好莱坞",
  "nav.series": "电视剧",
  "nav.animated": "动画",

  "rail.trending": "🔥 正在流行",
  "rail.movies": "好莱坞",
  "rail.animated": "动画",
  "rail.series": "电视剧",
  "rail.acclaimed": "广受好评",
  "rail.sci-fi": "科幻及更多",
  "rail.action": "动作与冒险",
  "rail.thriller": "扣人心弦",
  "rail.documentary": "纪录片",
  "rail.comedy": "喜剧",
  "rail.drama": "剧情",

  "cat.Action": "动作",
  "cat.Sci-Fi": "科幻",
  "cat.Drama": "剧情",
  "cat.Comedy": "喜剧",
  "cat.Documentary": "纪录片",
  "cat.Thriller": "惊悚",
  "cat.Animation": "动画",

  "search.placeholder": "搜索电影、剧集、类型…",
  "search.aria": "搜索影片",
  "search.clear": "清除搜索",

  "filter.by": "筛选",
  "filter.category": "类别",
  "filter.genre": "类型",
  "filter.year": "年份",
  "filter.all": "全部",
  "filter.movies": "电影",
  "filter.series": "剧集",
  "filter.animated": "动画",
  "filter.clear": "清除筛选",

  "results.for": "搜索结果：",
  "browse.title": "浏览",
  "count.one": "部",
  "count.many": "部",

  "empty.title": "未找到影片",
  "empty.nothingMatches": "没有匹配项",
  "empty.tryDifferent": "请尝试其他搜索或类别。",

  "continue.heading": "继续观看",
  "continue.watched": "已观看",
  "continue.remove": "从继续观看中移除",

  "detail.back": "返回浏览",
  "detail.cast": "演员",
  "detail.castLabel": "演员：",
  "detail.moreLikeThis": "更多类似内容",

  "title.play": "立即播放",
  "title.moreInfo": "更多信息",
  "hero.featured": "精选",

  "backToTop": "返回顶部",

  "player.loadingStream": "正在加载视频…",
  "player.loadingTrailer": "正在加载预告片…",
  "player.streamErrorTitle": "无法播放此视频",
  "player.streamErrorBody": "视频源可能暂时不可用。",
  "player.trailerErrorTitle": "无法播放此预告片",
  "player.trailerErrorBody": "该预告片在您所在地区可能不可用。",
  "player.tryAgain": "重试",

  "footer.tagline": "您的下一部最爱电影或剧集——搜索即得。",
  "footer.about":
    "StreaMatrix 是一个现代流媒体平台，将电影、剧集和动画汇聚一处——按类别、类型或年份浏览，几秒钟即可开始观看。",
  "footer.more": "更多",
  "footer.builtBy": "开发者",
  "footer.copyright": "多看片，少搜索。",

  "lang.select": "选择语言",

  "subscribe.promoTitle": "升级高级会员",
  "subscribe.pitch": "解锁 4K、无广告等。",
  "subscribe.cta": "立即订阅",
};

export const dictionaries = { en, ar, fr, ur, zh } satisfies Record<Locale, Dictionary>;

export type Messages = Dictionary;
