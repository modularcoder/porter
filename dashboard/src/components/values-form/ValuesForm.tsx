import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { Section, FormElement } from '../../shared/types';
import { Context } from '../../shared/Context';
import api from '../../shared/api';

import CheckboxRow from './CheckboxRow';
import InputRow from './InputRow';
import SelectRow from './SelectRow';
import Helper from './Helper';
import Heading from './Heading';
import ResourceTab from '../ResourceTab';

type PropsType = {
  sections?: Section[],
  metaState?: any,
  setMetaState?: any,
};

type StateType = any;

export default class ValuesForm extends Component<PropsType, StateType> {
  componentDidMount() {
    console.log('hola senorita')
  }
  getInputValue = (item: FormElement) => {
    let key = item.name || item.variable;
    let value = this.props.metaState[key];
    if (item.settings && item.settings.unit && value) {
      value = value.split(item.settings.unit)[0]
    }
    return value;
  }

  renderSection = (section: Section) => {
    return section.contents.map((item: FormElement, i: number) => {

      // If no name is assigned use values.yaml variable as identifier
      let key = item.name || item.variable;
      switch (item.type) {
        case 'heading':
          return <Heading key={i}>{item.label}</Heading>;
        case 'subtitle':
          return <Helper key={i}>{item.label}</Helper>;
        case 'resource-list':
          return (
            <ResourceList>
              {
                item.value.map((resource: any, i: number) => {
                  return (
                    <ResourceTab
                      label={resource.label}
                      name={resource.name}
                      status={{ label: resource.status }}
                    />
                  );
                })
              }
            </ResourceList>
          );
        case 'checkbox':
          return (
            <CheckboxRow
              key={i}
              checked={this.props.metaState[key]}
              toggle={() => this.props.setMetaState({ [key]: !this.props.metaState[key] })}
              label={item.label}
            />
          );
        case 'string-input':
          return (
            <InputRow
              key={i}
              isRequired={item.required}
              type='text'
              value={this.getInputValue(item)}
              setValue={(x: string) => {
                if (item.settings && item.settings.unit && x !== '') {
                  x = x + item.settings.unit;
                }
                this.props.setMetaState({ [key]: x });
              }}
              label={item.label}
              unit={item.settings ? item.settings.unit : null}
            />
          );
        case 'number-input':
          return (
            <InputRow
              key={i}
              isRequired={item.required}
              type='number'
              value={this.getInputValue(item)}
              setValue={(x: number) => {
                let val = x.toString();
                if (Number.isNaN(x)) {
                  val = '';
                } else if (item.settings && item.settings.unit) {
                  val = val + item.settings.unit;
                }
                this.props.setMetaState({ [key]: val });
              }}
              label={item.label}
              unit={item.settings ? item.settings.unit : null}
            />
          );
        case 'select':
          return (
            <SelectRow
              key={i}
              value={this.props.metaState[key]}
              setActiveValue={(val) => this.props.setMetaState({ [key]: val })}
              options={item.settings.options}
              dropdownLabel=''
              label={item.label}
            />
          );
        default:
      }
    });
  }

  renderFormContents = () => {
    if (this.props.metaState) {
      return this.props.sections.map((section: Section, i: number) => {
        // Hide collapsible section if deciding field is false
        if (section.show_if) {
          if (!this.props.metaState[section.show_if]) {
            return null;
          }
        }

        return (
          <div key={i}>
            {this.renderSection(section)}
          </div>
        );
      });
    }
  }

  render() {
    return (
      <StyledValuesForm>
        <DarkMatter />
        {this.renderFormContents()}
      </StyledValuesForm>
    );
  }
}

ValuesForm.contextType = Context;

const ResourceList = styled.div`
  margin-bottom: 15px;
  margin-top: 20px;
`;

const DarkMatter = styled.div`
  margin-top: 0px;
`;

const StyledValuesForm = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff11;
  color: #ffffff;
  padding: 0px 35px 25px;
  position: relative;
  border-radius: 5px;
  font-size: 13px;
  overflow: auto;
`;