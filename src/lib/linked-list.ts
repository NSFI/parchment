import LinkedNode = require('./linked-node');


class LinkedList<T extends LinkedNode> {
  head: T;
  tail: T;
  length: number;

  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  append(...nodes: T[]): void {
    this.insertBefore(nodes[0], undefined);
    if (nodes.length > 1) {
      this.append.apply(this, nodes.slice(1));
    }
  }

  insertBefore(node: T, refNode: T): void {
    node.next = refNode;
    if (!!refNode) {
      node.prev = refNode.prev;
      if (!!refNode.prev) {
        refNode.prev.next = node;
      }
      refNode.prev = node;
      if (refNode === this.head) {
        this.head = node;
      }
    } else if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      this.head = this.tail = node;
    }
    this.length += 1;
  }

  remove(node: T): void {
    if (!!node.prev) node.prev.next = node.next;
    if (!!node.next) node.next.prev = node.prev
    if (node === this.head) this.head = <T>node.next;
    if (node === this.tail) this.tail = <T>node.prev;
    node.prev = node.next = undefined;
    this.length -= 1;
  }

  iterator(curNode: T = this.head) {
    // TODO use yield when we can
    return function() {
      var ret = curNode;
      if (!!curNode) curNode = <T>curNode.next;
      return ret;
    }
  }

  find(index: number): [T, number] {
    var cur, next = this.iterator();
    while (cur = next()) {
      var length = cur.length();
      if (index < length) return [cur, index];
      index -= length;
    }
    return [null, 0];
  }

  forEach(callback): void {
    var cur, next = this.iterator();
    while (cur = next()) {
      callback(cur);
    }
  }

  forEachAt(index: number, length: number, callback): void {
    // TODO use this.find()
    var cur, curIndex = 0, next = this.iterator();
    while ((cur = next()) && curIndex < index + length) {
      var curLength = cur.length();
      if (index <= curIndex) {
        callback(cur, 0, Math.min(curLength, index + length - curIndex));
      } else if (index < curIndex + curLength) {
        callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
      }
      curIndex += curLength;
    }
  }

  reduce(callback, memo) {
    var cur, next = this.iterator();
    while (cur = next()) {
      memo = callback(memo, cur);
    }
    return memo;
  }
}


export = LinkedList;