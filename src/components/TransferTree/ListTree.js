import React from 'react';
import PropTypes from 'prop-types';
import Search from './Search';
import { Tree } from 'antd';

function noop() {
}

export default class ListTree extends React.Component {
  static defaultProps = {
    dataSource: [],
    titleText: '',
    treeKey: 'id',
    treeTitleKey: 'title',
    showSearch: false,
    handleClear: noop,
    handleFilter: noop,
    handleSelect: noop,
    handleSelectAll: noop,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    treeData: PropTypes.array,
    selectedKeys: PropTypes.array,
    showSearch: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    titleText: PropTypes.string,
    treeKey: PropTypes.string,
    treeTitleKey: PropTypes.string,
    style: PropTypes.object,
    handleClear: PropTypes.func,
    notFoundContent: PropTypes.string,
    filter: PropTypes.string,
    handleFilter: PropTypes.func,
    treeRender: PropTypes.func,
  };

  handleFilter = (e) => {
    this.props.handleFilter(e.target.value); 
  }

  handleClear = () => {
    this.props.handleFilter(""); 
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode key={item.key} selectable={false} title={item.title} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} dataRef={item} />;
    });
  }

  onSelect = (selectedKeys, info) => {
    this.props.onTreeSelected(info.selectedNodes)
  }

  render() {
    const { prefixCls, treeData, titleText, loadData, filter, treeKey, treeTitleKey, treeRender,
            showSearch, style, selectedKeys } = this.props;

    let { searchPlaceholder, notFoundContent } = this.props;

    const showTree = (
      <Tree 
        loadData={loadData}
        onSelect={this.onSelect}
        selectedKeys={selectedKeys}
        multiple
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );

    return (
      <div className={prefixCls} style={style}>
        <div className={`${prefixCls}-header tree-title`} style={{textAlign: 'center'}}>
          {titleText}
        </div>
        <div className={showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`}>
          {showSearch ? <div className={`${prefixCls}-body-search-wrapper`}>
            <Search prefixCls={`${prefixCls}-search`}
              onChange={this.handleFilter}
              handleClear={this.handleClear}
              placeholder={searchPlaceholder || '请输入搜索内容'}
              value={filter}
            />
          </div> : null}
          <div className={`${prefixCls}-body-content tree-content`}>
            {treeData.length ? showTree
              : <div className={`${prefixCls}-body-content-not-found`}>{notFoundContent || '列表为空'}</div>}
          </div>
        </div>
      </div>
    );
  }
}