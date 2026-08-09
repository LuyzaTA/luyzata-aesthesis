export type Lang = 'pt' | 'en'

const strings = {
  pt: {
    // Navigation
    navAriaMain: 'Navegação principal',
    navAriaMobile: 'Navegação mobile',
    navAriaClose: 'Fechar menu',
    navAriaOpen: 'Abrir menu',
    navLinkSobre: 'Sobre',
    navLinkContato: 'Contato',
    navLangToggle: 'Switch to English',

    // Footer
    footerTagline: 'αἴσθησις — Percepção pelos Sentidos, Sensação, Experiência Sensível ou Capacidade de Sentir.',
    footerCredit: 'Palavras e imagens por Luyza T.A.',
    footerNavTitle: 'Navegação',
    footerNavAria: 'Rodapé',
    footerInscTitle: 'Inscrição',
    footerMadeWith: 'Feito com palavras e silêncio.',

    // Hero
    heroTagline: 'Poesia • Fotografia • Reflexão',
    heroCta1: 'Entrar em Aesthesis',
    heroCta2: 'Explorar Fotos',
    heroAriaSection: 'Início',

    // Latest Photos
    latestLabel: 'Fotografia',
    latestTitle: 'Imagens Recentes',
    latestSub: 'Uma extensão visual da experiência poética.',
    latestCta: 'Ver galeria completa',
    latestAriaSection: 'Fotografia recente',

    // Reflections
    reflTitle: 'Poemas em Destaque',
    reflSub: 'Fragmentos de percepção e linguagem.',
    reflEmpty: 'Assinala uma estrela num poema para o destacar aqui.',
    reflCta: 'Ver todos os poemas',
    reflAriaSection: 'Poemas em destaque',

    // Featured Poem
    featuredLabel: 'Poema em Destaque',
    featuredReadMore: 'Ler poema completo',
    featuredAriaSection: 'Poema em destaque',

    // Poem Search
    searchAriaLabel: 'Pesquisar poemas',
    searchPlaceholder: 'Pesquisar poemas…',
    searchNewPoem: 'Novo Poema',
    searchNewPoemAria: 'Adicionar novo poema',
    searchLoading: 'A carregar…',
    searchPoems: 'poemas',
    searchOf: 'de',
    searchEmpty: 'Nenhum poema encontrado.',
    searchClear: 'Limpar filtros',

    // Poem Inline / Dynamic Poem Page
    poemMinRead: 'min de leitura',
    poemShare: 'Partilhar',
    poemNotFound: 'Poema não encontrado',
    poemNotFoundMsg: 'Este poema não existe ou foi removido.',
    poemBack: '← Voltar ao arquivo',

    // Poem Actions
    poemRemoveFeatured: 'Remover dos destaques',
    poemAddFeatured: 'Adicionar aos destaques',
    poemEditTitle: 'Editar poema',
    poemRemoveTitle: 'Remover poema',
    poemConfirm: 'Confirmar',
    poemCancel: 'Cancelar',

    // Add / Edit Poem Modal
    addPoemTitle: 'Novo Poema',
    editPoemTitle: 'Editar Poema',
    modalClose: 'Fechar ✕',
    modalCloseAria: 'Fechar',
    modalCancel: 'Cancelar',
    fieldTitle: 'Título',
    fieldTitlePlaceholder: 'Título do poema (opcional)',
    fieldAuthor: 'Autor',
    fieldLang: 'Língua',
    fieldPoem: 'Poema *',
    fieldPoemPlaceholder: 'Escreve o poema aqui…',
    fieldImgLabel: 'Imagem',
    fieldImgOptional: '(opcional)',
    fieldImgClickDrag: 'Clique ou arraste uma imagem',
    fieldImgRemove: 'Remover',
    fieldCreditLabel: 'Crédito da Foto',
    addPoemSubmit: 'Adicionar Poema',
    editPoemSave: 'Guardar',
    saving: 'A guardar…',
    errorInvalidImg: 'Selecione um ficheiro de imagem válido.',
    errorEmptyPoem: 'Escreva pelo menos um verso.',
    errorSave: 'Erro ao guardar. Tente novamente.',
    modalAriaImg: 'Selecionar ou arrastar imagem',

    // Password Modal
    pwdTitle: 'Acesso restrito',
    pwdLabel: 'Senha',
    pwdError: 'Senha incorreta',
    pwdEnter: 'Entrar',

    // Add Photo Modal
    addPhotoTitle: 'Nova Fotografia',
    addPhotoClick: 'Clique para selecionar ou arraste uma imagem',
    addPhotoFormats: 'JPG, PNG, AVIF, WEBP',
    addPhotoErrorImg: 'Por favor selecione um ficheiro de imagem.',
    addPhotoErrorSelect: 'Selecione uma imagem.',
    addPhotoAdd: 'Adicionar',
    addPhotoPreview: 'Pré-visualização',
    addPhotoAriaSelect: 'Selecionar ou arrastar imagem',

    // Masonry Gallery / Photo Gallery
    galleryImages: 'imagens',
    galleryAriaPrev: 'Imagem anterior',
    galleryAriaNext: 'Próxima imagem',
    gallerySave: 'Guardar',
    galleryEditAria: 'Editar descrição',
    galleryDeleteAria: 'Eliminar imagem',
    galleryConfirm: 'Confirmar',
    galleryClose: 'Fechar ✕',
    galleryAltPlaceholder: 'Descrição da imagem',
    galleryAddAria: 'Adicionar nova fotografia',
    galleryAddLabel: 'Nova Fotografia',

    // Aesthesis page header
    aesthesisPageSub: 'Percepção pelos Sentidos, Sensação, Experiência Sensível ou Capacidade de Sentir.',

    // Fotos page header
    fotosLabel: 'Fotografia',
    fotosTitle: 'Fotos',
    fotosCredit: 'Todas as fotos por L. Serrano',

    // Sobre page
    sobreTitle: 'Sobre Aesthesis',
    sobreCtaPoems: 'Explorar Poemas',
    sobreCtaContact: 'Entrar em Contato',
    sobreBioHeteronimo: 'Heterônimo Poético',
    sobreBioAge: 'Idade fictícia',
    sobreBioOrigin: 'Origem',
    sobreBioStyle: 'Estilo poético',
    sobreBioThemes: 'Temas centrais',
    sobreBioPersonality: 'Personalidade',
    sobreBioSignature: 'Assinatura poética',
    sobreBioHeteronimoVal: 'L. Serrano',
    sobreBioAgeVal: '87 anos',
    sobreBioOriginVal: 'Mundo, com família ligada à navegação e à literatura',
    sobreBioStyleVal: 'Introspectivo, existencial, com grande atenção a tempos e espaços internos, lembrando os fluxos de consciência de Clarice Lispector e a profundidade de Fernando Pessoa. Alternância de linguagens para se aproximar do sentir.',
    sobreBioThemesVal: 'Liberdade e confinamento, o tempo subjetivo, o diálogo entre interior e mundo externo, o ser versus o nada.',
    sobreBioPersonalityVal: 'Silencioso, observador, de fala rara; escreve para entender a si mesmo e ao mundo.',
    sobreBioSignatureVal: 'Usa imagens de mar, céu, portas, sombras e horizontes, de tempos sentidos, presença genuína.',
    sobreEdit: 'Editar',
    sobreSaving: 'A guardar…',
    sobreSaveError: 'Não foi possível guardar. Tente novamente.',

    // Contato page
    contatoLabel: 'Correspondência',
    contatoTitle: 'Contato',
    contatoEmailLabel: 'Email direto',
    contatoLocationLabel: 'Localização',
    contatoLocation: 'Brasil · Países Baixos',
    contatoQuote: '"A sua mensagem é bem-vinda."',

    // Contact Form
    contactFormAria: 'Formulário de contato',
    contactNameLabel: 'Nome',
    contactNamePlaceholder: 'O seu nome',
    contactEmailPlaceholder: 'o.seu@email.com',
    contactSubjectLabel: 'Assunto',
    contactSubjectDefault: 'Selecione um assunto',
    contactSubjectCollab: 'Colaboração artística',
    contactSubjectExpo: 'Exposição ou publicação',
    contactSubjectProject: 'Projeto literário ou fotográfico',
    contactSubjectThought: 'Partilhar um pensamento',
    contactSubjectOther: 'Outro',
    contactMessageLabel: 'Mensagem',
    contactMessagePlaceholder: 'Escreva a sua mensagem…',
    contactError: 'Ocorreu um erro. Tente novamente ou envie por email direto.',
    contactSubmit: 'Enviar Mensagem',
    contactSubmitting: 'Enviando…',
    contactSuccessTitle: 'Mensagem recebida.',
    contactSuccessSub: 'Obrigada pelo contacto. Responderei em breve.',
    contactSuccessBtn: 'Enviar outra mensagem',
  },

  en: {
    // Navigation
    navAriaMain: 'Main navigation',
    navAriaMobile: 'Mobile navigation',
    navAriaClose: 'Close menu',
    navAriaOpen: 'Open menu',
    navLinkSobre: 'About',
    navLinkContato: 'Contact',
    navLangToggle: 'Mudar para Português',

    // Footer
    footerTagline: 'αἴσθησις — Perception through the Senses, Sensation, Sensible Experience or the Capacity to Feel.',
    footerCredit: 'Words and images by Luyza T.A.',
    footerNavTitle: 'Navigation',
    footerNavAria: 'Footer',
    footerInscTitle: 'Inscription',
    footerMadeWith: 'Made with words and silence.',

    // Hero
    heroTagline: 'Poetry • Photography • Reflection',
    heroCta1: 'Enter Aesthesis',
    heroCta2: 'Explore Photos',
    heroAriaSection: 'Home',

    // Latest Photos
    latestLabel: 'Photography',
    latestTitle: 'Recent Images',
    latestSub: 'A visual extension of the poetic experience.',
    latestCta: 'View full gallery',
    latestAriaSection: 'Recent photography',

    // Reflections
    reflTitle: 'Featured Poems',
    reflSub: 'Fragments of perception and language.',
    reflEmpty: 'Mark a star on a poem to feature it here.',
    reflCta: 'See all poems',
    reflAriaSection: 'Featured poems',

    // Featured Poem
    featuredLabel: 'Featured Poem',
    featuredReadMore: 'Read full poem',
    featuredAriaSection: 'Featured poem',

    // Poem Search
    searchAriaLabel: 'Search poems',
    searchPlaceholder: 'Search poems…',
    searchNewPoem: 'New Poem',
    searchNewPoemAria: 'Add new poem',
    searchLoading: 'Loading…',
    searchPoems: 'poems',
    searchOf: 'of',
    searchEmpty: 'No poems found.',
    searchClear: 'Clear filters',

    // Poem Inline / Dynamic Poem Page
    poemMinRead: 'min read',
    poemShare: 'Share',
    poemNotFound: 'Poem not found',
    poemNotFoundMsg: 'This poem does not exist or was removed.',
    poemBack: '← Back to archive',

    // Poem Actions
    poemRemoveFeatured: 'Remove from featured',
    poemAddFeatured: 'Add to featured',
    poemEditTitle: 'Edit poem',
    poemRemoveTitle: 'Remove poem',
    poemConfirm: 'Confirm',
    poemCancel: 'Cancel',

    // Add / Edit Poem Modal
    addPoemTitle: 'New Poem',
    editPoemTitle: 'Edit Poem',
    modalClose: 'Close ✕',
    modalCloseAria: 'Close',
    modalCancel: 'Cancel',
    fieldTitle: 'Title',
    fieldTitlePlaceholder: 'Poem title (optional)',
    fieldAuthor: 'Author',
    fieldLang: 'Language',
    fieldPoem: 'Poem *',
    fieldPoemPlaceholder: 'Write the poem here…',
    fieldImgLabel: 'Image',
    fieldImgOptional: '(optional)',
    fieldImgClickDrag: 'Click or drag an image',
    fieldImgRemove: 'Remove',
    fieldCreditLabel: 'Photo Credit',
    addPoemSubmit: 'Add Poem',
    editPoemSave: 'Save',
    saving: 'Saving…',
    errorInvalidImg: 'Please select a valid image file.',
    errorEmptyPoem: 'Write at least one verse.',
    errorSave: 'Error saving. Please try again.',
    modalAriaImg: 'Select or drag image',

    // Password Modal
    pwdTitle: 'Restricted access',
    pwdLabel: 'Password',
    pwdError: 'Wrong password',
    pwdEnter: 'Enter',

    // Add Photo Modal
    addPhotoTitle: 'New Photo',
    addPhotoClick: 'Click to select or drag an image',
    addPhotoFormats: 'JPG, PNG, AVIF, WEBP',
    addPhotoErrorImg: 'Please select an image file.',
    addPhotoErrorSelect: 'Please select an image.',
    addPhotoAdd: 'Add',
    addPhotoPreview: 'Preview',
    addPhotoAriaSelect: 'Select or drag image',

    // Masonry Gallery / Photo Gallery
    galleryImages: 'images',
    galleryAriaPrev: 'Previous image',
    galleryAriaNext: 'Next image',
    gallerySave: 'Save',
    galleryEditAria: 'Edit description',
    galleryDeleteAria: 'Delete image',
    galleryConfirm: 'Confirm',
    galleryClose: 'Close ✕',
    galleryAltPlaceholder: 'Image description',
    galleryAddAria: 'Add new photo',
    galleryAddLabel: 'New Photo',

    // Aesthesis page header
    aesthesisPageSub: 'Perception through the Senses, Sensation, Sensible Experience or the Capacity to Feel.',

    // Fotos page header
    fotosLabel: 'Photography',
    fotosTitle: 'Photos',
    fotosCredit: 'All photographs by L. Serrano',

    // Sobre page
    sobreTitle: 'About Aesthesis',
    sobreCtaPoems: 'Explore Poems',
    sobreCtaContact: 'Get in Touch',
    sobreBioHeteronimo: 'Poetic Heteronym',
    sobreBioAge: 'Fictional Age',
    sobreBioOrigin: 'Origin',
    sobreBioStyle: 'Poetic Style',
    sobreBioThemes: 'Central Themes',
    sobreBioPersonality: 'Personality',
    sobreBioSignature: 'Poetic Signature',
    sobreBioHeteronimoVal: 'L. Serrano',
    sobreBioAgeVal: '87 years old',
    sobreBioOriginVal: 'World, with family ties to seafaring and literature',
    sobreBioStyleVal: 'Introspective, existential, with deep attention to inner times and spaces, echoing the stream of consciousness of Clarice Lispector and the depth of Fernando Pessoa. Alternation of languages to approach the feeling.',
    sobreBioThemesVal: 'Freedom and confinement, subjective time, the dialogue between the inner self and the outer world, being versus nothingness.',
    sobreBioPersonalityVal: 'Silent, observant, rarely speaking; writes to understand himself and the world.',
    sobreBioSignatureVal: 'Uses images of sea, sky, doors, shadows and horizons, of felt times, genuine presence.',
    sobreEdit: 'Edit',
    sobreSaving: 'Saving…',
    sobreSaveError: 'Could not save. Please try again.',

    // Contato page
    contatoLabel: 'Correspondence',
    contatoTitle: 'Contact',
    contatoEmailLabel: 'Direct email',
    contatoLocationLabel: 'Location',
    contatoLocation: 'Brazil · Netherlands',
    contatoQuote: '"Your message is welcome."',

    // Contact Form
    contactFormAria: 'Contact form',
    contactNameLabel: 'Name',
    contactNamePlaceholder: 'Your name',
    contactEmailPlaceholder: 'your@email.com',
    contactSubjectLabel: 'Subject',
    contactSubjectDefault: 'Select a subject',
    contactSubjectCollab: 'Artistic collaboration',
    contactSubjectExpo: 'Exhibition or publication',
    contactSubjectProject: 'Literary or photographic project',
    contactSubjectThought: 'Share a thought',
    contactSubjectOther: 'Other',
    contactMessageLabel: 'Message',
    contactMessagePlaceholder: 'Write your message…',
    contactError: 'An error occurred. Please try again or email directly.',
    contactSubmit: 'Send Message',
    contactSubmitting: 'Sending…',
    contactSuccessTitle: 'Message received.',
    contactSuccessSub: "Thank you for reaching out. I'll reply shortly.",
    contactSuccessBtn: 'Send another message',
  },
} as const

export type TranslationKey = keyof typeof strings.pt

export function getTranslations(lang: Lang) {
  return strings[lang]
}
