import { DefaultTypes, GCompartment, GCompartmentBuilder, GLabel } from '@eclipse-glsp/server';

export function createHeader(text: string, containerId: string, labelType = DefaultTypes.LABEL): GCompartment {
   return GCompartment.builder()
      .id(`${containerId}_header`)
      .layout('hbox')
      .addLayoutOption('hAlign', 'center')
      .addLayoutOption('vAlign', 'center')
      .addLayoutOption('paddingTop', 3)
      .addCssClass('header-compartment')
      .add(GLabel.builder().type(labelType).text(text).id(`${containerId}_label`).addCssClass('header-label').build())
      .build();
}

export class AttributesCompartmentBuilder extends GCompartmentBuilder {
   constructor() {
      super(GCompartment);
   }

   set(containerId: string): this {
      this.id(`${containerId}_attributes`)
         .addCssClass('attributes-compartment')
         .layout('vbox')
         .addLayoutOption('hAlign', 'left')
         .addLayoutOption('paddingBottom', 0);
      return this;
   }
}
