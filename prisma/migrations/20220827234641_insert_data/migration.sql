INSERT INTO public."FunctionalityType" (id, active, created_at, updated_at, deleted_at, description, name) VALUES 
('52a19d20-9904-4a2d-b7c5-ff3d25b80e41', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Tela do Menu Lateral', 'Telas que devem aparecer no menu lateral'),
('60d398d2-7f37-4728-8ebe-8d23871bbe31', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Tela', 'Telas que não devem aparecer no menu lateral');

INSERT INTO public."Functionality" (id, active, created_at, updated_at, deleted_at, description, name, path, "functionalityTypeId", "masterId") VALUES 
('8c29a940-463c-4670-914a-ef57cfb8cb3e', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Início', 'Página inicial', '', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', NULL),
('4356f7c3-a892-4183-8c8a-948a35449576', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Controle de Acesso', 'Menu de controle de acesso', null, '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', NULL);
