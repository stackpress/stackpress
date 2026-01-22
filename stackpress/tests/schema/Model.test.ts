//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockModel } from '../helpers.js';

describe('schema/spec/Model', () => {
  it('should return query', async () => {
    const model = await mockModel('User');
    expect(model.query).to.include('*');

    const actual = await mockModel('User', '@query("user.*" "article.comment.*")');
    expect(actual.query).to.include('user.*');
    expect(actual.query).to.include('article.comment.*');
  });
});
