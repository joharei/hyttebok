package content

import androidx.compose.runtime.Composable
import org.jetbrains.compose.web.css.*
import org.jetbrains.compose.web.dom.*
import style.AppCSSVariables
import style.AppStylesheet
import style.Row
import org.jetbrains.compose.web.dom.Header as DomHeader

private object HeaderStylesheet : StyleSheet(AppStylesheet) {
    val siteTitle by style {
        fontSize(AppCSSVariables.fontSizeNormal.value())
        fontStyle("normal")
        fontWeight(700)
        property("text-transform", "none")

        "a" style {
            textDecoration("none")
            hover(self) style {
                textDecoration("underline")
            }
        }
    }

    val nav by style {
        display(DisplayStyle.Flex)
        flexDirection(FlexDirection.Row)
        flexWrap(FlexWrap.Wrap)
        alignItems(AlignItems.Center)
        justifyContent(JustifyContent.FlexEnd)
        listStyle("none")

        "a" style {
            textDecoration("none")
        }
    }
}

@Composable
fun Header() {
    DomHeader({
        style {
            property("padding-top", AppCSSVariables.gapHorizontal.value())
            property("padding-bottom", AppCSSVariables.gapHorizontal.value())
        }
    }) {
        Div({
            classes(Row.row)
            style {
                justifyContent(JustifyContent.SpaceBetween)
            }
        }) {
            H1({ classes(HeaderStylesheet.siteTitle) }) {
                A(href = "/") {
                    Text("Hyttebok")
                }
            }

            Nav({
                style {
                    justifyContent(JustifyContent.FlexEnd)
                }
            }) {
                Ul({
                    classes(HeaderStylesheet.nav, Row.row)
                }) {
                    Li { A { Text("Til adminsiden") } }
                    Li { A { Text("Logg ut") } }
                }
            }
        }
    }
}