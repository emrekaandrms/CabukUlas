-- Duplikat kanallari temizle (ayni company + channel_type + value olan kayitlardan birini sil)
DELETE FROM contact_channels a
USING contact_channels b
WHERE a.id > b.id
  AND a.company_id = b.company_id
  AND a.channel_type = b.channel_type
  AND a.value = b.value;

-- Seed data'daki eski Twitter label'lari guncelle (Twitter Destek -> X Destek)
UPDATE contact_channels SET label = 'X (Twitter)' WHERE channel_type = 'twitter' AND label IN ('Twitter', 'Twitter Destek', 'X Destek');
