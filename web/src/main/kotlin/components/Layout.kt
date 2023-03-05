package components

import androidx.compose.runtime.Composable
import org.jetbrains.compose.web.css.*
import org.jetbrains.compose.web.dom.Div
import style.AppCSSVariables

@Composable
fun Layout(content: @Composable () -> Unit) {
    Div({
        style {
            minHeight(100.vh)
            display(DisplayStyle.Flex)
            flexDirection(FlexDirection.Column)
            property("padding-left", AppCSSVariables.gapHorizontal.value())
            property("padding-right", AppCSSVariables.gapHorizontal.value())
        }
    }) {
        content()
    }
}