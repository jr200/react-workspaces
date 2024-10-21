import * as React from 'react';
import { useCallback } from 'react';
import * as _ from 'lodash';
import { WorkspaceModel } from '../../core-models/WorkspaceModel';
import { WorkspaceEngine } from '../../core/WorkspaceEngine';
import styled from '@emotion/styled';
import { DividerWidget } from '../../widgets/primitives/DividerWidget';
import { DirectionChildWidget } from './DirectionalChildWidget';
import { ResizeDimensionContainer } from '../../entities/node/ResizeDimensionContainer';

export interface DirectionalLayoutWidgetProps {
  vertical: boolean;
  engine: WorkspaceEngine;
  data: WorkspaceModel[];
  shouldModelExpand: (model: WorkspaceModel) => boolean;
  generateElement: (model: WorkspaceModel) => React.JSX.Element;
  generateDivider: (divider: ResizeDimensionContainer) => React.JSX.Element;
  dimensionContainerForDivider: (index: number) => ResizeDimensionContainer;
  forwardRef: React.RefObject<HTMLDivElement>;
  className?: any;
}

namespace S {
  export const Container = styled.div<{ vertical: boolean }>`
    display: flex;
    flex-grow: 1;
    flex-direction: ${(p) => (p.vertical ? 'column' : 'row')};
    max-height: 100%;
  `;
}

export const DirectionalLayoutWidget: React.FC<DirectionalLayoutWidgetProps> = (props) => {
  if (props.data.length === 0) {
    return <S.Container ref={props.forwardRef} className={props.className} vertical={props.vertical}></S.Container>;
  }
  const firstDivider = props.dimensionContainerForDivider(0);
  const generateDivider = useCallback((dimension: ResizeDimensionContainer) => {
    if (props.generateDivider) {
      return props.generateDivider(dimension);
    }
    return (
      <DividerWidget
        activeColor={'transparent'}
        hoverColor={'transparent'}
        engine={props.engine}
        dimensionContainer={dimension}
      />
    );
  }, []);
  return (
    <S.Container ref={props.forwardRef} className={props.className} vertical={props.vertical}>
      <React.Fragment key={firstDivider.id}>{generateDivider(firstDivider)}</React.Fragment>
      {_.map(props.data, (model: WorkspaceModel, index) => {
        const dimension = props.dimensionContainerForDivider(index + 1);
        return (
          <React.Fragment key={model.id}>
            <DirectionChildWidget {...props} expand={props.shouldModelExpand(model)} model={model} />
            <React.Fragment key={dimension.id}>{generateDivider(dimension)}</React.Fragment>
          </React.Fragment>
        );
      })}
    </S.Container>
  );
};
