package style

import org.jetbrains.compose.web.css.*

object AppCSSVariables {
    val colorPrimary by variable<CSSColorValue>()
    val colorBackground by variable<CSSColorValue>()
    val colorForeground by variable<CSSColorValue>()

    val gapBaseline by variable<CSSNumeric>()
    val gapHorizontal by variable<StylePropertyString>()
    val gapVertical by variable<StylePropertyString>()

    val fontSizeNormal by variable<CSSNumeric>()
}

object AppStylesheet : StyleSheet() {
    init {
        universal style {
            AppCSSVariables.colorPrimary(Color("#000000"))
            AppCSSVariables.colorBackground(Color("#FFFAED"))
            AppCSSVariables.colorForeground(AppCSSVariables.colorPrimary.value())

            AppCSSVariables.gapBaseline(10.px)
            AppCSSVariables.gapHorizontal("min(30px, 5vw)")
            AppCSSVariables.gapVertical("min(30px, 5vw)")

            AppCSSVariables.fontSizeNormal(1.25.cssRem)
        }

        "body" style {
            backgroundColor(AppCSSVariables.colorBackground.value())
            color(AppCSSVariables.colorForeground.value())
            fontFamily("Source Serif Pro", "sans-serif")
            fontSize(AppCSSVariables.fontSizeNormal.value())
            fontWeight(400)
            lineHeight("1.7")
            padding(0.px)
        }

        "a" style {
            property("text-underline-offset", .15.cssRem)
        }
        "a" style {
            color(AppCSSVariables.colorForeground.value())
            textDecoration("underline")
        }
        "a:hover" style {
            textDecoration("none")
        }
        "a:focus" style {
            textDecoration("none")
        }
        "a:active" style {
            textDecoration("none")
        }

//        h1 {
//            font-size: min(max(3rem, 7vw), 5rem);
//            font-style: italic;
//            font-weight: normal;
//            line-height: 1.2;
//            margin-top: var(--wp--custom--gap--vertical);
//            margin-bottom: var(--wp--custom--gap--vertical);
//        }
//        h2 {
//            font-size: min(max(2.25rem, 6vw), 4.0625rem);
//            font-style: italic;
//            font-weight: normal;
//            line-height: 1.2;
//            margin-top: var(--wp--custom--gap--vertical);
//            margin-bottom: var(--wp--custom--gap--vertical);
//        }
//        h3 {
//            font-size: var(--wp--preset--font-size--large);
//            font-style: italic;
//            font-weight: normal;
//            line-height: 1.2;
//            margin-top: var(--wp--custom--gap--vertical);
//            margin-bottom: var(--wp--custom--gap--vertical);
//        }
//        h4 {
//            font-size: var(--wp--preset--font-size--large);
//            font-style: italic;
//            font-weight: normal;
//            line-height: 1.4;
//            margin-top: var(--wp--custom--gap--vertical);
//            margin-bottom: var(--wp--custom--gap--vertical);
//        }
//        h5 {
//            font-size: var(--wp--custom--font-size--normal);
//            font-style: italic;
//            font-weight: normal;
//            line-height: 1.4;
//            margin-top: var(--wp--custom--gap--vertical);
//            margin-bottom: var(--wp--custom--gap--vertical);
//        }
//        h6 {
//            font-size: var(--wp--preset--font-size--small);
//            font-style: italic;
//            font-weight: normal;
//            line-height: 1.4;
//            margin-top: var(--wp--custom--gap--vertical);
//            margin-bottom: var(--wp--custom--gap--vertical);
//        }
    }

//    body {
//        --wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);
//        --wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);
//        --wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);
//        --wp--preset--shadow--outlined: 6px 6px 0px -3px rgba(255, 255, 255, 1), 6px 6px rgba(0, 0, 0, 1);
//        --wp--preset--shadow--crisp: 6px 6px 0px rgba(0, 0, 0, 1);
//        --wp--preset--color--black: #000000;
//        --wp--preset--color--cyan-bluish-gray: #abb8c3;
//        --wp--preset--color--white: #ffffff;
//        --wp--preset--color--pale-pink: #f78da7;
//        --wp--preset--color--vivid-red: #cf2e2e;
//        --wp--preset--color--luminous-vivid-orange: #ff6900;
//        --wp--preset--color--luminous-vivid-amber: #fcb900;
//        --wp--preset--color--light-green-cyan: #7bdcb5;
//        --wp--preset--color--vivid-green-cyan: #00d084;
//        --wp--preset--color--pale-cyan-blue: #8ed1fc;
//        --wp--preset--color--vivid-cyan-blue: #0693e3;
//        --wp--preset--color--vivid-purple: #9b51e0;
//        --wp--preset--color--primary: #000000;
//        --wp--preset--color--secondary: #333333;
//        --wp--preset--color--background: #FFFAED;
//        --wp--preset--color--tertiary: #FFFFFF;
//        --wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%);
//        --wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);
//        --wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgba(252,185,0,1) 0%,rgba(255,105,0,1) 100%);
//        --wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%);
//        --wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);
//        --wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);
//        --wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);
//        --wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);
//        --wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);
//        --wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);
//        --wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);
//        --wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);
//        --wp--preset--duotone--dark-grayscale: url('#wp-duotone-dark-grayscale');
//        --wp--preset--duotone--grayscale: url('#wp-duotone-grayscale');
//        --wp--preset--duotone--purple-yellow: url('#wp-duotone-purple-yellow');
//        --wp--preset--duotone--blue-red: url('#wp-duotone-blue-red');
//        --wp--preset--duotone--midnight: url('#wp-duotone-midnight');
//        --wp--preset--duotone--magenta-yellow: url('#wp-duotone-magenta-yellow');
//        --wp--preset--duotone--purple-green: url('#wp-duotone-purple-green');
//        --wp--preset--duotone--blue-orange: url('#wp-duotone-blue-orange');
//        --wp--preset--font-size--small: 1.125rem;
//        --wp--preset--font-size--medium: 1.375rem;
//        --wp--preset--font-size--large: min(max(1.75rem, 5vw), 2.375rem);
//        --wp--preset--font-size--x-large: min(max(2.25rem, 5vw), 3rem);
//        --wp--preset--font-family--system-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
//        --wp--preset--font-family--arvo: Arvo, serif;
//        --wp--preset--font-family--bodoni-moda: 'Bodoni Moda', serif;
//        --wp--preset--font-family--cabin: Cabin, sans-serif;
//        --wp--preset--font-family--chivo: Chivo, sans-serif;
//        --wp--preset--font-family--courier-prime: 'Courier Prime', serif;
//        --wp--preset--font-family--dm-sans: 'DM Sans', sans-serif;
//        --wp--preset--font-family--domine: Domine, serif;
//        --wp--preset--font-family--eb-garamond: 'EB Garamond', serif;
//        --wp--preset--font-family--fira-sans: 'Fira Sans', sans-serif;
//        --wp--preset--font-family--helvetica-neue: 'Helvetica Neue','Helvetica', 'Arial', sans-serif;
//        --wp--preset--font-family--ibm-plex-mono: 'IBM Plex Mono', monospace;
//        --wp--preset--font-family--inter: Inter, sans-serif;
//        --wp--preset--font-family--josefin-sans: 'Josefin Sans', sans-serif;
//        --wp--preset--font-family--libre-baskerville: 'Libre Baskerville', serif;
//        --wp--preset--font-family--libre-franklin: 'Libre Franklin', sans-serif;
//        --wp--preset--font-family--lora: Lora, serif;
//        --wp--preset--font-family--merriweather: Merriweather, serif;
//        --wp--preset--font-family--montserrat: Montserrat, sans-serif;
//        --wp--preset--font-family--nunito: Nunito, sans-serif;
//        --wp--preset--font-family--open-sans: 'Open Sans', sans-serif;
//        --wp--preset--font-family--overpass: Overpass, sans-serif;
//        --wp--preset--font-family--playfair-display: 'Playfair Display', serif;
//        --wp--preset--font-family--poppins: Poppins, sans-serif;
//        --wp--preset--font-family--raleway: Raleway, sans-serif;
//        --wp--preset--font-family--red-hat-display: 'Red Hat Display', sans-serif;
//        --wp--preset--font-family--roboto: Roboto, sans-serif;
//        --wp--preset--font-family--roboto-slab: 'Roboto Slab', sans-serif;
//        --wp--preset--font-family--rubik: Rubik, sans-serif;
//        --wp--preset--font-family--source-sans-pro: 'Source Sans Pro', sans-serif;
//        --wp--preset--font-family--source-serif-pro: 'Source Serif Pro', sans-serif;
//        --wp--preset--font-family--space-mono: 'Space Mono', sans-serif;
//        --wp--preset--font-family--work-sans: 'Work Sans', sans-serif;
//        --wp--preset--font-family--albert-sans: 'Albert Sans';
//        --wp--preset--font-family--alegreya: Alegreya;
//        --wp--preset--font-family--commissioner: Commissioner;
//        --wp--preset--font-family--cormorant: Cormorant;
//        --wp--preset--font-family--crimson-pro: 'Crimson Pro';
//        --wp--preset--font-family--dm-mono: 'DM Mono';
//        --wp--preset--font-family--epilogue: Epilogue;
//        --wp--preset--font-family--figtree: Figtree;
//        --wp--preset--font-family--fraunces: Fraunces;
//        --wp--preset--font-family--ibm-plex-sans: 'IBM Plex Sans';
//        --wp--preset--font-family--jost: Jost;
//        --wp--preset--font-family--literata: Literata;
//        --wp--preset--font-family--newsreader: Newsreader;
//        --wp--preset--font-family--petrona: Petrona;
//        --wp--preset--font-family--piazzolla: Piazzolla;
//        --wp--preset--font-family--plus-jakarta-sans: 'Plus Jakarta Sans';
//        --wp--preset--font-family--sora: Sora;
//        --wp--preset--font-family--texturina: Texturina;
//        --wp--preset--spacing--20: 0.44rem;
//        --wp--preset--spacing--30: 0.67rem;
//        --wp--preset--spacing--40: 1rem;
//        --wp--preset--spacing--50: 1.5rem;
//        --wp--preset--spacing--60: 2.25rem;
//        --wp--preset--spacing--70: 3.38rem;
//        --wp--preset--spacing--80: 5.06rem;
//        --wp--custom--alignment--aligned-max-width: 50%;
//        --wp--custom--button--border--color: var(--wp--custom--color--foreground);
//        --wp--custom--button--border--radius: 0;
//        --wp--custom--button--border--style: solid;
//        --wp--custom--button--border--width: 3px;
//        --wp--custom--button--color--background: var(--wp--custom--color--foreground);
//        --wp--custom--button--color--text: var(--wp--custom--color--background);
//        --wp--custom--button--hover--color--text: var(--wp--custom--color--foreground);
//        --wp--custom--button--hover--color--background: var(--wp--custom--color--background);
//        --wp--custom--button--hover--border--color: var(--wp--custom--color--foreground);
//        --wp--custom--button--spacing--padding--top: 0.667em;
//        --wp--custom--button--spacing--padding--bottom: 0.667em;
//        --wp--custom--button--spacing--padding--left: 1.333em;
//        --wp--custom--button--spacing--padding--right: 1.333em;
//        --wp--custom--button--typography--font-size: var(--wp--custom--font-size--normal);
//        --wp--custom--button--typography--font-weight: 700;
//        --wp--custom--button--typography--line-height: 2;
//        --wp--custom--button--outline--color--text: var(--wp--custom--color--primary);
//        --wp--custom--button--outline--color--background: var(--wp--custom--color--background);
//        --wp--custom--button--outline--border--color: var(--wp--custom--color--primary);
//        --wp--custom--button--outline--hover--color--text: var(--wp--custom--color--background);
//        --wp--custom--button--outline--hover--color--background: var(--wp--custom--color--secondary);
//        --wp--custom--button--outline--hover--border--color: var(--wp--custom--color--primary);
//        --wp--custom--color--foreground: var(--wp--preset--color--primary);
//        --wp--custom--color--background: var(--wp--preset--color--background);
//        --wp--custom--color--primary: var(--wp--preset--color--primary);
//        --wp--custom--color--secondary: var(--wp--preset--color--secondary);
//        --wp--custom--color--tertiary: var(--wp--preset--color--tertiary);
//        --wp--custom--font-sizes--x-small: 1rem;
//        --wp--custom--font-sizes--normal: 1.25rem;
//        --wp--custom--font-sizes--huge: 3rem;
//        --wp--custom--form--padding: 20px;
//        --wp--custom--form--border--color: var(--wp--custom--color--foreground);
//        --wp--custom--form--border--radius: 0;
//        --wp--custom--form--border--style: solid;
//        --wp--custom--form--border--width: 2px;
//        --wp--custom--form--checkbox--checked--content: "\2715";
//        --wp--custom--form--checkbox--checked--font-size: var(--wp--custom--font-sizes--x-small);
//        --wp--custom--form--checkbox--checked--position--left: 3px;
//        --wp--custom--form--checkbox--checked--position--top: 3px;
//        --wp--custom--form--checkbox--checked--sizing--height: 12px;
//        --wp--custom--form--checkbox--checked--sizing--width: 12px;
//        --wp--custom--form--checkbox--unchecked--content: "";
//        --wp--custom--form--checkbox--unchecked--position--left: 0;
//        --wp--custom--form--checkbox--unchecked--position--top: 0.2em;
//        --wp--custom--form--checkbox--unchecked--sizing--height: 16px;
//        --wp--custom--form--checkbox--unchecked--sizing--width: 16px;
//        --wp--custom--form--color--background: transparent;
//        --wp--custom--form--color--box-shadow: none;
//        --wp--custom--form--color--text: inherit;
//        --wp--custom--form--label--spacing--margin--bottom: var(--wp--custom--gap--baseline);
//        --wp--custom--form--label--typography--font-size: var(--wp--custom--font-sizes--x-small);
//        --wp--custom--form--label--typography--font-weight: normal;
//        --wp--custom--form--label--typography--letter-spacing: normal;
//        --wp--custom--form--label--typography--text-transform: none;
//        --wp--custom--form--typography--font-size: var(--wp--custom--font-sizes--normal);
//        --wp--custom--gallery--caption--font-size: var(--wp--preset--font-size--small);
//        --wp--custom--body--typography--line-height: 1.7;
//        --wp--custom--heading--typography--font-weight: 700;
//        --wp--custom--heading--typography--line-height: 1.125;
//        --wp--custom--latest-posts--meta--color--text: var(--wp--custom--color--primary);
//        --wp--custom--layout--content-size: 664px;
//        --wp--custom--gap--baseline: 10px;
//        --wp--custom--gap--horizontal: min(30px, 5vw);
//        --wp--custom--gap--vertical: min(30px, 5vw);
//        --wp--custom--navigation--submenu--border--color: var(--wp--custom--color--primary);
//        --wp--custom--navigation--submenu--border--radius: var(--wp--custom--form--border--radius);
//        --wp--custom--navigation--submenu--border--style: var(--wp--custom--form--border--style);
//        --wp--custom--navigation--submenu--border--width: var(--wp--custom--form--border--width);
//        --wp--custom--navigation--submenu--color--background: var(--wp--custom--color--background);
//        --wp--custom--navigation--submenu--color--text: var(--wp--custom--color--foreground);
//        --wp--custom--paragraph--dropcap--margin: 0 .2em .2em 0;
//        --wp--custom--paragraph--dropcap--typography--font-size: var(--wp--preset--font-size--x-large);
//        --wp--custom--paragraph--dropcap--typography--font-weight: 400;
//        --wp--custom--post-author--typography--font-weight: normal;
//        --wp--custom--post-comment--typography--font-size: var(--wp--custom--font-sizes--normal);
//        --wp--custom--post-comment--typography--line-height: var(--wp--custom--body--typography--line-height);
//        --wp--custom--pullquote--citation--typography--font-size: var(--wp--custom--font-sizes--x-small);
//        --wp--custom--pullquote--citation--typography--font-family: inherit;
//        --wp--custom--pullquote--citation--typography--font-style: normal;
//        --wp--custom--pullquote--citation--typography--font-weight: 400;
//        --wp--custom--pullquote--citation--spacing--margin--top: var(--wp--custom--gap--vertical);
//        --wp--custom--pullquote--typography--text-align: left;
//        --wp--custom--quote--citation--typography--font-size: var(--wp--custom--font-sizes--x-small);
//        --wp--custom--quote--citation--typography--font-style: normal;
//        --wp--custom--quote--citation--typography--font-weight: 400;
//        --wp--custom--quote--typography--text-align: left;
//        --wp--custom--separator--opacity: 1;
//        --wp--custom--separator--width: 150px;
//        --wp--custom--table--figcaption--typography--font-size: var(--wp--custom--font-sizes--x-small);
//        --wp--custom--video--caption--text-align: center;
//        --wp--custom--video--caption--margin: var(--wp--custom--gap--vertical) auto;
//        --wp--custom--line-height--body: 1.7;
//    }
}