class TextRenderComponent extends Component {

    constructor(entityID, text, options={}) {

        super(entityID);

        this.text  = text;
        this.fontSize = options.fontSize || 18;
        this.fontFamily = options.fontFamily || 'serif';
        this.align = options.align || 'left';
        this.propOffset = options.propOffset || [0,0];

    }

}

const a = new TextRenderComponent()