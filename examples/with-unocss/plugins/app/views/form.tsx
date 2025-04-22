import 'frui/frui.css'

import Autocomplete from 'frui/field/Autocomplete';
import Checkbox from 'frui/field/Checkbox';
import Country from 'frui/field/Country';
import Currency from 'frui/field/Currency';
import Date from 'frui/field/Date';
import Datetime from 'frui/field/Datetime';
import File from 'frui/field/File';
import Filelist from 'frui/field/Filelist';
import ImageField from 'frui/field/Image';
import Imagelist from 'frui/field/Imagelist';
import Input from 'frui/field/Input';
import Markdown from 'frui/field/Markdown';
import Mask from 'frui/field/Mask';
import Metadata from 'frui/field/Metadata';
import Number from 'frui/field/Number';
import Password from 'frui/field/Password';
import Radio from 'frui/field/Radio';
import Select from 'frui/field/Select';
import Slug from 'frui/field/Slug';
import Switch from 'frui/field/Switch';
import Taglist from 'frui/field/Taglist';
import Textarea from 'frui/field/Textarea';
import Textlist from 'frui/field/Textlist';
import Time from 'frui/field/Time';

import Layout from '../Layout.js';

export default function FormPage() {
  const _ = (text: string) => text;
  return (
    <Layout>
      <form className="flex flex-wrap mt-4">
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Autocomplete name="autocomplete" options={[ 'foo', 'bar' ]} value="bar" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Autocomplete')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Checkbox name="checkbox" defaultChecked label="Enable" className="text-white" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Checkbox')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Country name="country" className="w-full" value="US" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Country')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Currency name="currency" className="w-full" value="USD" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Currency')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Date name="date" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Date')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Datetime name="datetime" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Datetime')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <div className="text-left">
                <Textlist name="textlist[]" value={['foobar']} add="Add More" />
              </div>
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Fieldset')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <File 
                name="file" 
                className="bg-white w-[150px]" 
                onUpload={(_file, next) => {
                  //just a mock call
                  setTimeout(() => {
                    next('https://images.wsj.net/im-580612/8SR')
                  }, 5000)
                }} 
              />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('File')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Filelist 
                name="filelist[]" 
                className="bg-white w-[150px]" 
                defaultValue={[
                  'https://images.wsj.net/8SR.pdf'
                ]} 
                onUpload={(files, next) => {
                  //just a mock call
                  setTimeout(() => {
                    next(files.map((_file, _i) => 'https://images.wsj.net/im-580612/8SR'))
                  }, 1000)
                }}
              />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Filelist')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] bg-b1">
              <ImageField 
                name="image" 
                className="bg-white w-[150px]" 
                value="https://images.wsj.net/im-580612/8SR" 
                onUpload={(_image, next) => {
                  //just a mock call
                  setTimeout(() => {
                    next('https://images.wsj.net/im-580612/8SR')
                  }, 5000)
                }} 
              />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Image')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Imagelist 
                name="imagelist[]" 
                className="bg-white w-[150px]" 
                defaultValue={[
                  'https://images.wsj.net/im-580612/8SR'
                ]} 
                onUpload={(files, next) => {
                  //just a mock call
                  setTimeout(() => {
                    next(files.map((_file, _i) => 'https://images.wsj.net/im-580612/8SR'))
                  }, 1000)
                }}
              />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Imagelist')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Input name="input" placeholder="Basic Input" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Input')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Markdown name="markdown" rows={2} defaultValue="# FRUI" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Markdown')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Mask name="mask" mask="999-999-9999" placeholder="999-999-9999" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Mask')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <div className="text-left">
                <Metadata name="metadata" add="Add More" value={Object.entries({ foo: 'bar' })} />
              </div>
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Metadata')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Number name="number" defaultValue="1234.56" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Number')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Password name="password" value="1234567890" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Password')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Radio name="radio" value="y" rounded defaultChecked className="text-white" label="Yes" />
              <Radio name="radio" value="n" rounded defaultChecked={false} className="text-white ml-2" label="No" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Radio')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Select name="select" searchable className="w-full" onQuery={(_query, update) => {
                //just a mock call
                setTimeout(() => {
                  update([
                    { label: 'Foo', value: 'foo' },
                    { label: 'Bar', value: 'bar' },
                    { label: 'Baz', value: 'baz' }
                  ])
                }, 1000)
              }} options={[
                {
                  label: (
                    <div className="flex items-center w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="foobar" height="30" width="30" src="https://e7.pngegg.com/pngimages/971/854/png-clipart-white-and-gray-illustration-angle-symbol-snout-fictional-character-black-metroui-apps-foobar-angle-logo-thumbnail.png" />
                        <div className="ml-2 text-left flex-grow">Foobar</div>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                  ),
                  value: 'foobar'
                },
                {
                  label: (
                    <div className="flex items-center w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="foobar" height="30" width="30" src="https://e7.pngegg.com/pngimages/971/854/png-clipart-white-and-gray-illustration-angle-symbol-snout-fictional-character-black-metroui-apps-foobar-angle-logo-thumbnail.png" />
                        <div className="ml-2 text-left flex-grow">Barfoo</div>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                  ),
                  value: 'barfoo'
                }
              ]} value="barfoo" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Select')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Slug name="slug" value="I am a Title" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Slug')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Switch name="switch" ridge defaultChecked rounded />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Switch')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Taglist name="taglist[]" value={['foo', 'bar']} />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Taglist')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Textarea name="textarea" placeholder="Morbi tincidunt, dolor at sodales auctor, magna eros sagittis enim, ut aliquet velit nulla vel metus." />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Textarea')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <div className="text-left">
                <Textlist name="textlist[]" value={['foobar']} add="Add More" />
              </div>
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Textlist')}
            </h2>
          </div>
        </div>
        <div 
          className="block basis-full sm:basis-1/2 md:basis-1/3 text-center cursor-pointer"
        >
          <div className="m-2 border border-black border-solid rounded">
            <div className="flex items-center justify-center h-[130px] px-px-10 px-w-100-20 hex-bg-999">
              <Time name="time" />
            </div>
            <h2 className="my-2 font-semibold text-center uppercase">
              {_('Time')}
            </h2>
          </div>
        </div>
        <button>Submit</button>
      </form>
    </Layout>
  );
}