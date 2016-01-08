# MMT-22, MMT-10, MMT-8

require 'rails_helper'

describe 'Search published results', js: true do
  short_name = 'CIESIN_SEDAC_ESI_2000'
  version = '2000.00'
  entry_title = '2000 Pilot Environmental Sustainability Index (ESI)'
  provider = 'SEDAC'
  concept_id = 'C1200000000-SEDAC'

  before :each do
    login
    visit '/search'
  end

  context 'when performing a collection search by quick find entry id' do
    before do
      fill_in 'short_name', with: short_name
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_search_query(1, "Short Name: #{short_name}", 'Record State: Published Records')
    end
    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'short_name')
        expect(page).to have_field('search_term', with: short_name)
      end
    end
  end

  context 'when searching by entry id' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Short Name', from: 'search_term_type'
      fill_in 'search_term', with: short_name
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Short Name: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'short_name')
        expect(page).to have_field('search_term', with: short_name)
      end
    end
  end

  # Is actually searching published and drafts for a published by entry id
  context 'when searching published records by entry id' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Published & Draft Records', from: 'record_state'
      select 'Short Name', from: 'search_term_type'
      fill_in 'search_term', with: short_name
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Short Name: #{short_name}", 'Record State: Published And Draft Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end
  end

  context 'when searching by entry title' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry Title', from: 'search_term_type'
      fill_in 'search_term', with: entry_title
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Entry Title: #{entry_title}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry title in the full search form' do
        expect(page).to have_field('search_term_type', with: 'entry_title')
        expect(page).to have_field('search_term', with: entry_title)
      end
    end
  end

  context 'when searching by partial entry title' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry Title', from: 'search_term_type'
      fill_in 'search_term', with: entry_title[5..25]
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Entry Title: #{entry_title[5..25]}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry title in the full search form' do
        expect(page).to have_field('search_term_type', with: 'entry_title')
        expect(page).to have_field('search_term', with: entry_title[5..25])
      end
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'Full Metadata Record Search'
      select 'LARC', from: 'provider_id'
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_content('30 Results for: Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('ACR3L2DM')
      expect(page).to have_content('1')
      expect(page).to have_content('ACRIM III Level 2 Daily Mean Data V001')
      expect(page).to have_content('LARC')
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the provider in the full search form' do
        expect(page).to have_field('provider_id', with: 'LARC')
      end
    end
  end

  context 'when searching by CMR Concept Id' do
    before do
      click_on 'Full Metadata Record Search'
      select 'CMR Concept ID', from: 'search_term_type'
      fill_in 'search_term', with: concept_id
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Concept Id: #{concept_id}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the concept id in the full search form' do
        expect(page).to have_field('search_term_type', with: 'concept_id')
        expect(page).to have_field('search_term', with: concept_id)
      end
    end
  end

  context 'when performing a search that has no results' do
    before do
      fill_in 'short_name', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
  end
end
