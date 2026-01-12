//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockModel } from '../../helpers.js';

describe('schema/spec/Model', () => {
  it('should return query', async () => {
    const model = mockModel('User');
    expect(model.query).to.include('*');

    const actual = mockModel('User', '@query("user.*" "article.comment.*")');
    expect(actual.query).to.include('user.*');
    expect(actual.query).to.include('article.comment.*');
  });
});
