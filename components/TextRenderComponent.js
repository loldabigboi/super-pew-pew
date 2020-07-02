class TextRenderComponent extends Component {

    constructor(entityID, text, style={}) {

        super(entityID);

        this.text  = text;
        this.style = style;

    }

    set style(newStyle) {

        this.fontSize = newStyle.fontSize || this.fontSize || 18;
        this.fontFamily = newStyle.fontFamily || this.fontFamily || 'serif';
        this.align = newStyle.align || this.align || 'left';
        this.propOffset = newStyle.propOffset || this.propOffset || [0,0];

    }

}

const a = new TextRenderComponent()