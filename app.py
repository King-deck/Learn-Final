import streamlit as st

# Configuración básica de la página
st.set_page_config(
    page_title="Héroes - Transformación Educativa",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Función para cargar el HTML
def show_html():
    with open("index.html", "r", encoding="utf-8") as f:
        html_code = f.read()
    st.components.v1.html(html_code, height=1000, scrolling=True)

# Ejecución principal
if __name__ == "__main__":
    show_html()