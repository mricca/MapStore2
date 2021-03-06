/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import PropTypes from 'prop-types';
import { FormControl, FormGroup } from 'react-bootstrap';
import ColorSelector from './ColorSelector';
import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import numberLocalizer from 'react-widgets/lib/localizers/simple-number';
numberLocalizer();
import { NumberPicker } from 'react-widgets';
import assign from 'object-assign';

class ThemaClassesEditor extends React.Component {
    static propTypes = {
        classification: PropTypes.array,
        onUpdateClasses: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        classification: [],
        onUpdateClasses: () => {},
        className: ""
    };

    renderClasses = () => {
        return this.props.classification.map((classItem, index) => (
            <FormGroup
                key={index}>
                <ColorSelector
                    key={classItem.color}
                    color={classItem.color}
                    disableAlpha
                    format="hex"
                    onChangeColor={(color) => this.updateColor(index, color)}
                />
                { !isNil(classItem.unique)
                    ? isNumber(classItem.unique)
                        ? <NumberPicker
                            format="- ###.###"
                            value={classItem.unique}
                            onChange={(value) => this.updateUnique(index, value, 'number')}
                        />
                        : <FormControl value={classItem.unique} type="text" onChange={ e => this.updateUnique(index, e.target.value)} />
                    : <>
                        <NumberPicker
                            format="- ###.###"
                            value={classItem.min}
                            onChange={(value) => this.updateMin(index, value)}
                        />
                        <NumberPicker
                            format="- ###.###"
                            value={classItem.max}
                            precision={3}
                            onChange={(value) => this.updateMax(index, value)}
                        /></>
                }
            </FormGroup>
        ));
    };

    render() {
        return (<div className={"thema-classes-editor " + this.props.className}>
            {this.renderClasses()}
        </div>);
    }

    updateColor = (classIndex, color) => {
        if (color) {
            const newClassification = this.props.classification.map((classItem, index) => {
                return index === classIndex ? assign({}, classItem, {
                    color
                }) : classItem;
            });
            this.props.onUpdateClasses(newClassification, 'color');
        }
    };

    updateUnique = (classIndex, unique, type = 'text') => {
        const newClassification = this.props.classification.map((classItem, index) => {
            if (index === classIndex) {
                return assign({}, classItem, {
                    unique: isNil(unique) ? type === 'number' ? 0 : '' : unique
                });
            }
            return classItem;
        });
        this.props.onUpdateClasses(newClassification, 'interval');
    };

    updateMin = (classIndex, min) => {
        if (!isNaN(min)) {
            const newClassification = this.props.classification.map((classItem, index) => {
                if (index === classIndex) {
                    return assign({}, classItem, {
                        min
                    });
                }
                return classItem;
            });
            this.props.onUpdateClasses(newClassification, 'interval');
        }
    };

    updateMax = (classIndex, max) => {
        if (!isNaN(max)) {
            const newClassification = this.props.classification.map((classItem, index) => {
                if (index === classIndex) {
                    return assign({}, classItem, {
                        max
                    });
                }
                if (index === (classIndex + 1)) {
                    return assign({}, classItem, {
                        min: max
                    });
                }
                return classItem;
            });
            this.props.onUpdateClasses(newClassification, 'interval');
        }
    };

}

export default ThemaClassesEditor;
