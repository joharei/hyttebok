package style

import org.jetbrains.compose.web.css.*

object Row : StyleSheet(AppStylesheet) {
    val row by style {
        display(DisplayStyle.Flex)
        flexWrap(FlexWrap.Wrap)
        alignItems(AlignItems.Center)
        gap(2 * AppCSSVariables.gapBaseline.value())
    }
}